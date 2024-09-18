<template>
  <div id="canvasWrapper">
    <div
      style="
        height: 20px;
        position: absolute;
        top: 3%;
        color: #fff;
        font-size: 18px;
      "
    >
      <span>鼠标左键点击选取蒙版，鼠标右击取消选取的蒙版</span>
    </div>
    <div>111</div>
    <div id="canvasContainer">
      <canvas id="backgroundCanvas"></canvas>
      <canvas id="selectionCanvas"></canvas>
      <canvas id="maskCanvas"></canvas>
    </div>
    <div
      style="position: absolute; top: 20px; right: 20px; cursor: pointer"
      @click="close"
    >
      关闭
    </div>
  </div>
</template>

<script>
export default {
  props: {
    mask: Object, // 用于传递蒙版对象
    bgImage: String, // 背景图像 URL
  },
  data() {
    return {
      backgroundImage: new Image(),
      inWhiteArea: false,
      selectedMasks: new Set(),
      backgroundData: null,
      masks: [], // 初始的蒙版 URL 列表
      maskData: [], // 存储处理后的蒙版数据
      maskImage: null,
      scaleRatio: 1, // 缩放比例，用于蒙版图片
    };
  },
  mounted() {
    this.loadBackground(this.bgImage); // 加载背景图
    console.log(this.mask);

    this.masks = Object.values(this.mask);
    console.log(this.masks, "蒙版图");
  },
  methods: {
    close() {
      this.$emit("close", this.maskImage); // 关闭事件
    },
    loadBackground(imageSrc) {
    const backgroundCanvas = this.$el.querySelector("#backgroundCanvas");
    const bgCtx = backgroundCanvas.getContext("2d");

    this.backgroundImage.src = imageSrc;
    this.backgroundImage.crossOrigin = "anonymous";
    this.backgroundImage.onload = () => {
      // 获取屏幕宽度和高度
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      // 动态计算宽高，确保按比例缩放
      let canvasWidth, canvasHeight;
      
      if (this.backgroundImage.width > this.backgroundImage.height) {
        // 宽度主导，保持宽度为屏幕宽度的某个百分比
        canvasWidth = screenWidth * 0.6; // 占据屏幕60%的宽度
        canvasHeight = (this.backgroundImage.height / this.backgroundImage.width) * canvasWidth;
      } else {
        // 高度主导，保持高度为屏幕高度的某个百分比
        canvasHeight = screenHeight * 0.6; // 占据屏幕60%的高度
        canvasWidth = (this.backgroundImage.width / this.backgroundImage.height) * canvasHeight;
      }

      // 设置 canvas 的宽度和高度
      backgroundCanvas.width = this.backgroundImage.width;
      backgroundCanvas.height = this.backgroundImage.height;

      // 绘制背景图
      bgCtx.drawImage(this.backgroundImage, 0, 0);

      // 获取背景图的像素数据
      this.backgroundData = bgCtx.getImageData(
        0,
        0,
        backgroundCanvas.width,
        backgroundCanvas.height
      );

      // 设置缩放比例，使 canvas 根据屏幕比例显示
      this.scaleRatio = canvasWidth / backgroundCanvas.width;

      // 按比例调整蒙版画布
      const maskCanvas = this.$el.querySelector("#maskCanvas");
      const selectionCanvas = this.$el.querySelector("#selectionCanvas");
      maskCanvas.width = backgroundCanvas.width;
      maskCanvas.height = backgroundCanvas.height;
      selectionCanvas.width = backgroundCanvas.width;
      selectionCanvas.height = backgroundCanvas.height;

      // 对canvas元素进行缩放显示，但保持原尺寸
      backgroundCanvas.style.transform = `scale(${this.scaleRatio})`;
      selectionCanvas.style.transform = `scale(${this.scaleRatio})`;
      maskCanvas.style.transform = `scale(${this.scaleRatio})`;
      backgroundCanvas.style.transformOrigin = 'top left';
      selectionCanvas.style.transformOrigin = 'top left';
      maskCanvas.style.transformOrigin = 'top left';

      // 初始化蒙版
      this.initMasks();
    };
  },
    // loadBackground(imageSrc) {
    //   const backgroundCanvas = this.$el.querySelector("#backgroundCanvas");
    //   const bgCtx = backgroundCanvas.getContext("2d");

    //   this.backgroundImage.src = imageSrc;
    //   this.backgroundImage.crossOrigin = "anonymous";
    //   this.backgroundImage.onload = () => {
    //     // 设置背景图 canvas 的宽度和高度
    //     backgroundCanvas.width = this.backgroundImage.width;
    //     backgroundCanvas.height = this.backgroundImage.height;

    //     // 绘制背景图
    //     bgCtx.drawImage(this.backgroundImage, 0, 0);

    //     // 获取背景图的像素数据
    //     this.backgroundData = bgCtx.getImageData(
    //       0,
    //       0,
    //       backgroundCanvas.width,
    //       backgroundCanvas.height
    //     );

    //     // 设置缩放比例
    //     const displayWidth = 300;
    //     this.scaleRatio = displayWidth / backgroundCanvas.width;

    //     // 按比例调整蒙版画布
    //     const maskCanvas = this.$el.querySelector("#maskCanvas");
    //     const selectionCanvas = this.$el.querySelector("#selectionCanvas");
    //     maskCanvas.width = backgroundCanvas.width;
    //     maskCanvas.height = backgroundCanvas.height;
    //     selectionCanvas.width = backgroundCanvas.width;
    //     selectionCanvas.height = backgroundCanvas.height;

    //     // 对canvas元素进行缩放显示，但保持原尺寸
    //     backgroundCanvas.style.transform = `scale(${this.scaleRatio})`;
    //     selectionCanvas.style.transform = `scale(${this.scaleRatio})`;
    //     maskCanvas.style.transform = `scale(${this.scaleRatio})`;
    //     backgroundCanvas.style.transformOrigin = "top left";
    //     selectionCanvas.style.transformOrigin = "top left";
    //     maskCanvas.style.transformOrigin = "top left";

    //     // 初始化蒙版
    //     this.initMasks();
    //   };
    // },
    async initMasks() {
      const maskCanvas = this.$el.querySelector("#maskCanvas");
      const maskCtx = maskCanvas.getContext("2d");

      // 遍历蒙版URL并加载
      for (let maskUrl of this.masks) {
        const whiteAreaCoords = await this.loadMask(
          maskUrl,
          maskCtx,
          maskCanvas
        );
        this.maskData.push({ maskUrl, whiteAreaCoords });
      }

      // 为 maskCanvas 添加事件监听
      maskCanvas.addEventListener("mousemove", this.handleMouseMove);
      maskCanvas.addEventListener("click", this.handleClick);
      maskCanvas.addEventListener("contextmenu", this.handleRightClick);
    },
    loadMask(imageSrc, maskCtx, maskCanvas) {
      return new Promise((resolve) => {
        const maskImage = new Image();
        const whiteAreaCoords = [];

        maskImage.src = imageSrc;
        maskImage.crossOrigin = "anonymous";
        maskImage.onload = () => {
          // 将蒙版图像按背景图的宽高绘制到蒙版画布上
          maskCtx.drawImage(
            maskImage,
            0,
            0,
            maskCanvas.width,
            maskCanvas.height
          );

          const maskData = maskCtx.getImageData(
            0,
            0,
            maskCanvas.width,
            maskCanvas.height
          ).data;

          // 提取白色区域的坐标
          for (let y = 0; y < maskCanvas.height; y++) {
            for (let x = 0; x < maskCanvas.width; x++) {
              const index = (y * maskCanvas.width + x) * 4;
              const red = maskData[index];
              const green = maskData[index + 1];
              const blue = maskData[index + 2];

              if (red === 255 && green === 255 && blue === 255) {
                whiteAreaCoords.push({ x, y });
              }
            }
          }

          // 清除蒙版画布以准备下一张蒙版的绘制
          maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
          resolve(whiteAreaCoords);
        };
      });
    },
    handleMouseMove(event) {
      const rect = this.$el
        .querySelector("#maskCanvas")
        .getBoundingClientRect();
      const mouseX = (event.clientX - rect.left) / this.scaleRatio; // 考虑缩放比例
      const mouseY = (event.clientY - rect.top) / this.scaleRatio;

      let overlappingMasks = [];

      const backgroundCanvas = this.$el.querySelector("#backgroundCanvas");
      const bgCtx = backgroundCanvas.getContext("2d");

      // 清除背景图像并重绘
      bgCtx.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
      bgCtx.drawImage(this.backgroundImage, 0, 0);

      for (let mask of this.maskData) {
        if (
          mask.whiteAreaCoords.some(
            (coord) =>
              coord.x === Math.floor(mouseX) && coord.y === Math.floor(mouseY)
          )
        ) {
          overlappingMasks.push(mask);
        }
      }

      if (overlappingMasks.length > 0) {
        overlappingMasks.sort(
          (a, b) => a.whiteAreaCoords.length - b.whiteAreaCoords.length
        );
        overlappingMasks[0].whiteAreaCoords.forEach(({ x, y }) => {
          bgCtx.fillStyle = "rgba(128, 0, 128, 0.5)";
          bgCtx.fillRect(x, y, 1, 1);
        });
      }
    },
    handleClick(event) {
      const rect = this.$el
        .querySelector("#maskCanvas")
        .getBoundingClientRect();
      const mouseX = (event.clientX - rect.left) / this.scaleRatio;
      const mouseY = (event.clientY - rect.top) / this.scaleRatio;

      let overlappingMasks = [];
      for (let mask of this.maskData) {
        if (
          mask.whiteAreaCoords.some(
            (coord) =>
              coord.x === Math.floor(mouseX) && coord.y === Math.floor(mouseY)
          )
        ) {
          overlappingMasks.push(mask);
        }
      }

      if (overlappingMasks.length > 0) {
        overlappingMasks.sort(
          (a, b) => a.whiteAreaCoords.length - b.whiteAreaCoords.length
        );
        const selectedMask = overlappingMasks[0];

        if (!this.selectedMasks.has(selectedMask)) {
          this.selectedMasks.add(selectedMask);
          this.renderOnSelectionCanvas(selectedMask.whiteAreaCoords);
        }
      }
    },
    handleRightClick(event) {
      event.preventDefault();
      const rect = this.$el
        .querySelector("#maskCanvas")
        .getBoundingClientRect();
      const mouseX = (event.clientX - rect.left) / this.scaleRatio;
      const mouseY = (event.clientY - rect.top) / this.scaleRatio;

      let overlappingMasks = [];
      for (let mask of this.maskData) {
        if (
          mask.whiteAreaCoords.some(
            (coord) =>
              coord.x === Math.floor(mouseX) && coord.y === Math.floor(mouseY)
          )
        ) {
          overlappingMasks.push(mask);
        }
      }

      if (overlappingMasks.length > 0) {
        overlappingMasks.sort(
          (a, b) => a.whiteAreaCoords.length - b.whiteAreaCoords.length
        );
        const selectedMask = overlappingMasks[0];

        if (this.selectedMasks.has(selectedMask)) {
          this.selectedMasks.delete(selectedMask);
          this.redrawAllSelectedMasks();
        }
      }
    },
    renderOnSelectionCanvas(whiteAreaCoords) {
      const selectionCanvas = this.$el.querySelector("#selectionCanvas");
      const selectionCtx = selectionCanvas.getContext("2d");
      this.drawTransparentBackground(selectionCtx, selectionCanvas.width, selectionCanvas.height)
      // 使用背景图的颜色对蒙版进行着色
      whiteAreaCoords.forEach(({ x, y }) => {
        const index = (y * selectionCanvas.width + x) * 4;
        const r = this.backgroundData.data[index];
        const g = this.backgroundData.data[index + 1];
        const b = this.backgroundData.data[index + 2];
        const a = this.backgroundData.data[index + 3] / 255;

        // 用背景图的颜色进行填充
        selectionCtx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
        selectionCtx.fillRect(x, y, 1, 1);
      });

      this.maskImage = selectionCanvas.toDataURL("image/png");
    },
    redrawAllSelectedMasks() {
      const selectionCanvas = this.$el.querySelector("#selectionCanvas");
      const selectionCtx = selectionCanvas.getContext("2d");
      selectionCtx.clearRect(
        0,
        0,
        selectionCanvas.width,
        selectionCanvas.height
      );

      this.selectedMasks.forEach((mask) => {
        this.renderOnSelectionCanvas(mask.whiteAreaCoords);
      });
    },
    drawTransparentBackground(ctx, width, height) {
      // 定义方格大小和颜色
      const gridSize = 30;
      const color1 = "#cccccc"; // 浅灰色
      const color2 = "#ffffff"; // 白色

      // 绘制交替的方格
      for (let y = 0; y < height; y += gridSize) {
        for (let x = 0; x < width; x += gridSize) {
          ctx.fillStyle = (x / gridSize + y / gridSize) % 2 === 0 ? color1 : color2;
          ctx.fillRect(x, y, gridSize, gridSize);
        }
      }
    },
  },
};
</script>

<style scoped>
#canvasWrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  transition: opacity 0.3s ease, visibility 0.3s ease;
}
#canvasContainer {
  position: relative;
  width: 300px;
  height: 300px;
}

#backgroundCanvas,
#maskCanvas,
#selectionCanvas {
  position: absolute;
  left: 0;
  top: 0;
}
#selectionCanvas {
  left: 320px;
  height: auto;
}
</style>
