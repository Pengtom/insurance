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
      radio: '推荐'
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
    init() {
      const params = { type: "1", name: "" }
      queryListTask(params).then(res => {
        this.tasks = res.data
        this.tasks.forEach(item => {
          if (item.primaryImage) {
            item.uploadedImage = item.primaryImage
          } else {
            item.imagesrc = "https://www.weshop.com/mask.svg"
          }
          this.$set(item, 'showOptions', false);
        })
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
      // const res = await save({ type: 1, name: "任务-" + newTaskId })
      // newTask.id = res.msg;
      this.tasks.unshift(newTask)
      this.currentTaskId = newTask.id;
      this.isDrawerVisible = true;
    },

    toggleOptions() {
      this.currentTask.showOptions = !this.currentTask.showOptions;
    },

    async deleteTask(taskId) {
      await deleteTaskById(taskId)
      this.init()
      this.showOptions = false;
    },

    resizeImage(imageFile, maxSize) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxSize) {
              height *= maxSize / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width *= maxSize / height;
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Canvas could not convert image to Blob.'));
            }
          }, imageFile.type);
        };
        img.onerror = (error) => reject(error);
        img.src = URL.createObjectURL(imageFile);
      });
    },
    iSImageStatus(file) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result;
        const img = new Image();
        img.onerror = () => {
          this.$message.error('图片文件无法加载，文件可能已损坏');
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    },
    async handleUpload(file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/bmp', 'image/webp'];
      const isAllowedType = allowedTypes.includes(file.file.type);
      if (!isAllowedType) {
        this.$message.error('不允许上传此类型的文件');
        return;
      }
      const isLt10M = file.file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        this.$message.error('图片大小不能超过 10MB!');
        return;
      }
      this.iSImageStatus(file.file)
      this.uploadingTaskId = this.currentTaskId;

      try {
        const resizedImageBlob = await this.resizeImage(file.file, 1024);
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

        const formdata = new FormData()
        formdata.append("file", file.file)
        formdata.append("type", "0")
        console.log(formdata);

        const res = await upload(formdata)
        console.log(res);
        if (task) {
          console.log(task);
          this.$set(task, 'uploadedImage', res.url);
          this.$set(task, "fileList", file.file)
          this.$set(task, "clickCoordinates", [])
          this.$set(task, "type", [])
        }
        this.$set(this.currentTask, 'loading', true);
        const qzProject = {
          id: this.currentTask.id,
          primaryImage: this.currentTask.uploadedImage,
          maskImage: this.currentTask.maskImageSrc
        }
        console.log(qzProject);
        // update(qzProject)
      } finally {
        this.uploadingTaskId = null;
      }
    },

    openDrawer(taskId) {
      if (this.currentTaskId !== taskId) {
        this.currentTaskId = taskId;
        this.isDrawerVisible = true;
      }
    },

    handleDrawerClose() {
      this.isDrawerVisible = false;
      this.currentTaskId = null;
    },

    getImageClickCoordinates(event) {
      event.preventDefault()
      if (this.currentTask.clickCoordinates) {
        if (this.currentTask.clickCoordinates.length > 10) {
          this.$message.error("点击次数太多！")
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
          .then(data => {
            const maskBase64 = data.masks;
            const maskBase64Masksf = data.masksf;
            this.$set(this.currentTask, "maskImageSrc", `data:image/png;base64,${maskBase64}`)
            this.$set(this.currentTask, "lastMask", `data:image/png;base64,${maskBase64Masksf}`)
            this.applyMask(maskBase64)
          })
      }
    },
    applyMask(maskBase) {
      const imageUrl = URL.createObjectURL(this.currentTask.fileList); // 替换为你的图像URL
      const maskBase64 = `data:image/png;base64,${maskBase}`

      const imageCanvas = document.getElementById('imageCanvas');
      const maskCanvas = document.getElementById('maskCanvas');
      const resultCanvas = document.getElementById('resultCanvas');

      const imageContext = imageCanvas.getContext('2d');
      const maskContext = maskCanvas.getContext('2d');
      const resultContext = resultCanvas.getContext('2d');

      const image = new Image();
      const mask = new Image();

      image.src = imageUrl;
      mask.src = maskBase64;

      image.onload = () => {
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
        const maskImage = resultCanvas.toDataURL();
        this.$set(this.currentTask, 'maskImage', maskImage)
      };
    },
    async img2img(){
      const fileName = Date.now()
      let fileImg = this.dataURLtoBlob(this.currentTask.maskImageSrc,fileName+'.png')
      const formdata = new FormData()
      formdata.append("file", fileImg)
      formdata.append("type", "1")
      const res = await upload(formdata)
      console.log(res,"============================");
      
      const Img2imgVo = {
        projectId: this.currentTask.id,
        type : "0",
        selectModelId : "1707581895913837020",
        selectPmodeId:"",
        lastImage:this.currentTask.uploadedImage,
        lastMask:res.url
      }

      await img2img(Img2imgVo)
      
    },
    dataURLtoBlob(dataurl, name) {
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
    },
  },
  watch: {
    isDrawerVisible() {
      this.$emit("data", this.isDrawerVisible)
    },
    'currentTask.loading'(newValue) {
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