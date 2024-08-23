import { queryListTask, save, upload, update, deleteTaskById } from '@/api/zhiqi/task'
import { Loading } from 'element-ui';
import { img2img } from '@/api/zhiqi/sd';
export default {
  props: {
    context: Object,
  },
  data() {
    return {
      dialogVisible: false,
      tasks: [],
      currentTaskId: String, // 当前正在编辑的任务的 ID
      isDrawerVisible: false,
      uploadingTaskId: null,
      loadingInstance: null, // 用于保存 loading 实例
      radio: 0,
      selectModelId: '', //模特id
      selectFlag: false,
      quantity: 1,
    };
  },
  computed: {
    currentTask() {
      return this.tasks.find(task => task.id === this.currentTaskId) || {};
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      const params = { type: "1", name: "" }
      const res = await queryListTask(params)
      this.tasks = res.data
      this.tasks.forEach(item => {
        if (item.primaryImage) {
          item.uploadedImage = item.primaryImage
        } else {
          item.imagesrc = "https://www.weshop.com/mask.svg"
        }
        if (item.maskImage) {
          this.$set(item, 'maskImageSrc', item.maskImage)
        }
        this.$set(item, 'showOptions', false);
      })
    },
    async addTask() {
      const newTaskId = Date.now() % 100000000 .toString(); // 使用时间戳作为唯一标识符
      const newTask = {
        id: newTaskId,
        imagesrc: "https://www.weshop.com/mask.svg",
        dialogVisible: false,
        uploadedImage: null,
        fileList: [],
        showOptions: false,
        active: true
      };
      const res = await save({ type: 1, name: "任务-" + newTaskId })
      newTask.id = res.msg;
      this.tasks.unshift(newTask)
      this.currentTaskId = newTask.id;
      this.isDrawerVisible = true;
    },

    toggleOptions() {
      this.currentTask.showOptions = !this.currentTask.showOptions;
    },

    async deleteTask(taskId) {
      await deleteTaskById(taskId)
      this.tasks = this.tasks.filter(item => item.id !== taskId)
      this.init()
      if (this.tasks.length === 0) {
        this.isDrawerVisible = false
      }
      this.showOptions = false;
    },
    resizeImage(file, targetHeight) {
      return new Promise((resolve, reject) => {
        // 创建 FileReader 对象读取文件内容
        const reader = new FileReader();

        // 当文件读取成功时
        reader.onload = (event) => {
          const image = new Image();
          image.src = event.target.result;

          image.onload = () => {
            // 创建临时画布以保持缩放后的图像
            const tmp_canvas = document.createElement('canvas');
            const tmp_ctx = tmp_canvas.getContext('2d');

            // 计算缩放因子
            let scaleFactor = 1;
            if (image.height > targetHeight) {
              scaleFactor = targetHeight / image.height;
            }

            // 计算缩放后的宽度和高度
            const scaledWidth = image.width * scaleFactor;
            const scaledHeight = image.height * scaleFactor;

            // 设置画布的大小
            tmp_canvas.width = scaledWidth;
            tmp_canvas.height = scaledHeight;

            // 绘制缩放后的图像到画布上
            tmp_ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, scaledWidth, scaledHeight);

            // 将画布内容转换为 Blob
            tmp_canvas.toBlob((blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error("Canvas to Blob conversion failed"));
              }
            });
          };

          // 处理图像加载错误
          image.onerror = (error) => {
            reject(new Error("Image loading failed"));
          };
        };

        // 处理文件读取错误
        reader.onerror = (error) => {
          reject(new Error("File reading failed"));
        };

        // 读取文件为 Data URL
        reader.readAsDataURL(file);
      });
    },
    iSImageStatus(file) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result;
        const img = new Image();
        img.onerror = () => {
          this.$message({
            message: "❌ 图片文件无法加载，文件可能已损坏 ❗",
            type: 'error',
          });
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    },
    async handleUpload(file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/bmp', 'image/webp'];
      const isAllowedType = allowedTypes.includes(file.file.type);
      if (!isAllowedType) {
        this.$message({
          message: "❌ 不允许上传此类型的文件 ❗",
          type: 'error',
        });
        return;
      }
      const isLt5M = file.file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        this.$message({
          message: "❌ 图片大小不能超过 5MB ❗",
          type: 'error',
        });
        return;
      }
      this.iSImageStatus(file.file)
      this.uploadingTaskId = this.currentTaskId;

      try {
        const resizedImageBlob = await this.resizeImage(file.file, 1024);
        console.log(resizedImageBlob);

        const imageByteArray = await blobToByteArray(resizedImageBlob);

        const form = new FormData();
        form.append('image', new Blob([imageByteArray]), "image.png");
        const task = this.currentTask;
        fetch('/apix/imagev2', {
          method: "POST",
          body: form
        }).then((response) => response.json())
          .then((data) => {
            if (task) {
              this.$set(task, 'fileName', data.message);
            }
          }).catch(error => {
            console.log(error);
          })

        const blob = await readFileAsBlob(resizedImageBlob);
        const newFile = new File([blob], resizedImageBlob.name, { type: resizedImageBlob.type });
        const formdata = new FormData()
        formdata.append("file", newFile)
        formdata.append("type", "0")
        console.log(formdata);

        const res = await upload(formdata)
        console.log(res);
        if (task) {
          console.log(task);
          this.$set(task, 'uploadedImage', res.url);
          this.$set(task, "fileList", newFile)
          this.$set(task, "clickCoordinates", [])
          this.$set(task, "type", [])
        }
        this.$set(this.currentTask, 'loading', true);
      } finally {
        this.uploadingTaskId = null;
      }
    },

    async openDrawer(taskId) {
      if (this.currentTask.id !== taskId) {
        this.currentTaskId = taskId;
        this.isDrawerVisible = true;
        if (this.currentTask.maskImage) {
          this.$set(this.currentTask, 'loading', true);
          const res = await this.applyMask(this.currentTask.maskImage)
          console.log(res, "=================");

          this.$set(this.currentTask, 'loading', false);
        }
      }
    },

    handleDrawerClose() {
      this.isDrawerVisible = false;
      this.currentTaskId = null;
    },

    getImageClickCoordinates(event) {
      event.preventDefault()
      if (this.currentTask.clickCoordinates) {
        if (this.currentTask.clickCoordinates.length > 20) {
          this.$message({
            message: "❌ 点击次数太多 ❗",
            type: 'error',
          });
          return;
        }
      } else {
        this.$set(this.currentTask, "clickCoordinates", [])
        this.$set(this.currentTask, "type", [])
      }
      const imgElement = this.$refs.uploadedImage;

      if (imgElement) {
        const rect = imgElement.getBoundingClientRect();
        const imageWidth = rect.width
        const imageHeight = rect.height
        const target = 1024
        const scaleW = target / imageWidth
        const scaleH = target / imageHeight
        const x = Math.round((event.clientX - rect.left) * scaleW);
        const y = Math.round((event.clientY - rect.top) * scaleH);
        this.currentTask.clickCoordinates.push(x);
        this.currentTask.clickCoordinates.push(y);
        if (event.button === 0) {
          this.currentTask.type.push(1)
        }
        if (event.button === 2) {
          this.currentTask.type.push(0)
        }
        console.log('点击坐标:', this.currentTask.clickCoordinates);
        const formdata = new FormData()
        formdata.append("type", this.currentTask.type)
        formdata.append("click_list", this.currentTask.clickCoordinates);
        formdata.append("file_name", this.currentTask.fileName)
        fetch("/apix/clickv2", {
          method: 'post',
          body: formdata
        }).then(res => res.json())
          .then(async data => {
            const maskBase64 = data.masks;
            const maskBase64Masksf = data.masksf;
            this.$set(this.currentTask, "maskImage", `data:image/png;base64,${maskBase64}`)
            this.$set(this.currentTask, "lastMask", `data:image/png;base64,${maskBase64Masksf}`)
            await this.applyMask(`data:image/png;base64,${maskBase64}`)
          })
      }
    },
    applyMask(maskBase) {
      return new Promise((resolve, reject) => {
        const imageUrl = this.currentTask.uploadedImage;
        const maskBase64 = maskBase;

        const imageCanvas = document.getElementById('imageCanvas');
        const maskCanvas = document.getElementById('maskCanvas');
        const resultCanvas = document.getElementById('resultCanvas');

        const imageContext = imageCanvas.getContext('2d');
        const maskContext = maskCanvas.getContext('2d');
        const resultContext = resultCanvas.getContext('2d');

        const image = new Image();
        const mask = new Image();
        image.crossOrigin = 'anonymous';
        mask.crossOrigin = 'anonymous';
        image.src = imageUrl;
        mask.src = maskBase64;

        let imagesLoaded = 0;
        const onImageLoad = () => {
          imagesLoaded++;
          if (imagesLoaded === 2) { // 确保两个图像都加载完成
            try {
              imageCanvas.width = image.width;
              imageCanvas.height = image.height;
              maskCanvas.width = image.width;
              maskCanvas.height = image.height;
              resultCanvas.width = image.width;
              resultCanvas.height = image.height;

              imageContext.drawImage(image, 0, 0);
              maskContext.drawImage(mask, 0, 0);

              const imageData = imageContext.getImageData(0, 0, image.width, image.height);
              const maskData = maskContext.getImageData(0, 0, image.width, image.height);

              const resultData = resultContext.createImageData(image.width, image.height);

              for (let i = 0; i < imageData.data.length; i += 4) {
                const alpha = maskData.data[i] > 128 ? 255 : 0; // 使用蒙版的亮度作为阈值
                resultData.data[i] = imageData.data[i];
                resultData.data[i + 1] = imageData.data[i + 1];
                resultData.data[i + 2] = imageData.data[i + 2];
                resultData.data[i + 3] = alpha;
              }

              resultContext.putImageData(resultData, 0, 0);
              const maskImageSrc = resultCanvas.toDataURL();
              this.$set(this.currentTask, 'maskImageSrc', maskImageSrc);
              resolve(); // 处理完成，解析 Promise
            } catch (error) {
              reject(error); // 处理过程中发生错误，拒绝 Promise
            }
          }
        };

        image.onload = onImageLoad;
        mask.onload = onImageLoad;
      });
    }
    ,
    async openDialog() {
      if (this.currentTask.fileName) {
        this.dialogVisible = true
        return
      }
      const file = await getFileFromUrl(this.currentTask.uploadedImage, Date.now() + ".png")
      this.uploadingTaskId = this.currentTaskId;
      this.$set(this.currentTask, 'loading', true);
      try {
        const resizedImageBlob = await this.resizeImage(file, 1024);
        console.log(resizedImageBlob);

        const imageByteArray = await blobToByteArray(resizedImageBlob);

        const form = new FormData();
        form.append('image', new Blob([imageByteArray]), "image.png");
        const task = this.currentTask;
        fetch('/apix/imagev2', {
          method: "POST",
          body: form
        }).then((response) => response.json())
          .then((data) => {
            if (task) {
              this.$set(task, 'fileName', data.message);
              this.dialogVisible = true
            }
          }).catch(error => {
            console.log(error);
          })
      } finally {
        this.uploadingTaskId = null;
      }
    },
    async dialogclose() {
      const fileName = Date.now()
      let fileImg = dataURLtoBlob(this.currentTask.maskImage, fileName + '.png')
      const formdata = new FormData()
      formdata.append("file", fileImg)
      formdata.append("type", "1")
      const res = await upload(formdata)
      console.log(res, "============================");
      this.$set(this.currentTask, "maskImage", res.url)
      const qzProject = {
        id: this.currentTask.id,
        primaryImage: this.currentTask.uploadedImage,
        maskImage: res.url
      }
      console.log(qzProject);
      update(qzProject)
      this.dialogVisible = false
    },
    modelId(selectModelId) {
      this.selectModelId = selectModelId
    },
    radioval(radioval) {
      this.radio = radioval
    },
    async img2img() {
      if (!this.selectModelId && this.radio !== 1) {
        this.$message({
          message: "❌ 请选择或填写AI模特、商拍场景或描述中的至少一项 ❗",
          type: '',
        })
        return
      }
      const Img2imgVo = {
        projectId: this.currentTask.id,
        type: this.radio,
        selectModelId: this.selectModelId,
        selectPmodelId: "1707581895913837020",
        lastImage: this.currentTask.uploadedImage,
        lastMask: this.currentTask.maskImage,
        quantity: this.quantity
      }
      console.log(Img2imgVo);

      // await img2img(Img2imgVo)
    },
    openSelectFlag() {
      this.selectFlag = !this.selectFlag
    },
    selectNum(num) {
      this.quantity = num
    }
  },
  watch: {
    isDrawerVisible() {
      this.$emit("data", this.isDrawerVisible)
    },
    'currentTask.loading'(newValue) {
      console.log(newValue);

      if (newValue) {
        // 当加载开始时
        this.$nextTick(() => {
          this.loadingInstance = Loading.service({
            target: ".image-preview2",
            text: '加载中...',
            background: 'rgba(255, 255, 255, 0.7)' // 设置背景色
          });
        });
      } else {
        // 当加载结束时
        if (this.loadingInstance) {
          this.loadingInstance.close();
          this.loadingInstance = null;
          this.currentTask.loading = null
        }
      }
    },
    'currentTask.fileName'(newval) {
      if (newval) {
        this.$set(this.currentTask, "loading", false)
      }
    }
  }
};
async function blobToByteArray(blob) {
  return new Uint8Array(await new Response(blob).arrayBuffer());
}

function readFileAsBlob(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const dataUrl = fileReader.result;
      const [header, base64] = dataUrl.split(',');
      const mime = header.match(/:(.*?);/)[1];
      const binary = atob(base64);
      const binaryLength = binary.length;
      const u8arr = new Uint8Array(binaryLength);

      for (let i = 0; i < binaryLength; i++) {
        u8arr[i] = binary.charCodeAt(i);
      }

      const blob = new Blob([u8arr], { type: mime });
      resolve(blob);
    };
    fileReader.onerror = () => reject(new Error('FileReader failed'));
    fileReader.readAsDataURL(file);
  });
}

function dataURLtoBlob(dataurl, name) {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], name, {
    type: mime
  });
}

function getFileFromUrl(url, fileName) {
  return new Promise((resolve, reject) => {
    var blob = null;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.setRequestHeader('Accept', 'image/png');
    xhr.responseType = "blob";
    // 加载时处理
    xhr.onload = () => {
      // 获取返回结果
      blob = xhr.response;
      let file = new File([blob], fileName, { type: 'image/png' });
      // 返回结果
      resolve(file);
    };
    xhr.onerror = (e) => {
      reject(e)
    };
    // 发送
    xhr.send();
  });
}