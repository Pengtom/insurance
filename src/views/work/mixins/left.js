import { Loading } from 'element-ui';
import { upload, update, deleteTaskById, getOne } from '@/api/zhiqi/task'
import { getComputingPowerTotal } from '@/api/zhiqi/computeUsage'
import store from '@/store'
export default {
    props: {
        context: Object,
    },
    data() {
        return {
            tasks: [],
            currentTaskId: String, // 当前正在编辑的任务的 ID
            isDrawerVisible: false,
            dialogVisible: false,
            quantity: 1,
            projectDetails: {},
            statusMap: {
                0: '未启动',
                1: '等待中',
                2: '已完成',
                3: '失败'
            },
        }
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
        toggleOptions(taskId) {
            const task = this.tasks.find(task => task.id === taskId)
            task.showOptions = !task.showOptions
        },
        async getProjectDetails(id) {
            const res = await getOne(id)
            this.projectDetails = res.data
        },

        async deleteTask(taskId, type) {

            await deleteTaskById(taskId, type)
            this.tasks = this.tasks.filter(item => item.id !== taskId)
            this.init()
            // if (this.tasks.length === 0) {
            this.isDrawerVisible = false
            this.$emit('success', { isSuccess: false })
            // }
        },
        async openDrawer(taskId) {
            const task = this.tasks.find(task => task.id === taskId)
            if (!this.currentTask || Object.keys(this.currentTask).length === 0) {
                if (task.taskType === 1 || task.taskType === 2) {
                    this.$emit('success', {
                        id: taskId,
                        image: task.uploadedImage,
                        name: task.name,
                        isSuccess: true,
                    })
                    this.currentTaskId = taskId;
                    return
                }
            }
            if (this.currentTask.id !== taskId) {
                if (task.taskType === 2 || task.taskType === 1) {
                    this.$emit('success', {
                        id: taskId,
                        image: task.uploadedImage,
                        name: task.name,
                        isSuccess: true,
                    })
                    this.currentTaskId = taskId;
                    this.isDrawerVisible = false;
                    return
                }

                this.currentTaskId = taskId;
                this.isDrawerVisible = true;
            }
        },
        handleDrawerClose() {
            this.isDrawerVisible = false;
            this.currentTaskId = null; // 关闭抽屉不能再次选择同抽屉
        },
        async handleUpload(file) {
            const allowedTypes = ["image/gif", "image/avif"];
            const isAllowedType = allowedTypes.includes(file.file.type);
            if (isAllowedType) {
                this.$message({
                    message: "❌ 不允许上传此类型的文件 ❗",
                    type: "",
                });
                return;
            }
            const isLt5M = file.file.size / 1024 / 1024 < 5;
            if (!isLt5M) {
                this.$message({
                    message: "❌ 图片大小不能超过 5MB ❗",
                    type: "",
                });
                return;
            }
            const imageStatus = await this.iSImageStatus(file.file);

            if (!imageStatus.isValid) {
                const fileList = this.currentTask.fileList.filter(
                    (f) => f.uid !== file.file.uid
                );
                this.$set(this.currentTask, "fileList", fileList);
                return;
            }
            if (this.currentTask.fileList) {
                const fileList = this.currentTask.fileList.filter(
                    (f) => f.uid === file.file.uid
                );
                this.$set(this.currentTask, "fileList", fileList);
            }
            this.$set(this.currentTask, "uploading", true);

            const resizedImageBlob = await this.resizeImage(file.file, 1024);

            const blob = await readFileAsBlob(resizedImageBlob);
            const newFile = new File([blob], resizedImageBlob.name, {
                type: resizedImageBlob.type,
            });
            const formdata = new FormData();
            formdata.append("file", newFile);
            formdata.append("type", "0");

            const res = await upload(formdata);
            update({ id: this.currentTask.id, primaryImage: res.url, mask: false });
            const task = this.currentTask;
            this.$set(task, "uploadedImage", res.url);
            this.$set(task, "fileList", [newFile]);
            this.$set(this.currentTask, "uploading", false);
        },
        resizeImage(file, targetSize) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();

                reader.onload = (event) => {
                    const image = new Image();
                    image.src = event.target.result;

                    image.onload = () => {
                        const tmp_canvas = document.createElement('canvas');
                        const tmp_ctx = tmp_canvas.getContext('2d');

                        let scaleFactor;
                        const { width, height } = image;

                        if (width > height) {
                            scaleFactor = targetSize / width;
                            tmp_canvas.width = targetSize;
                            tmp_canvas.height = height * scaleFactor;

                            // 处理高度调整
                            let heightAfterScale = tmp_canvas.height - 512;
                            const heightRemainder = heightAfterScale % 64;
                            const heightAdjustment = (heightRemainder < 32) ? -heightRemainder : (64 - heightRemainder);
                            tmp_canvas.height += heightAdjustment;
                        } else if (width < height) {
                            scaleFactor = targetSize / height;
                            tmp_canvas.width = width * scaleFactor;
                            tmp_canvas.height = targetSize;

                            // 处理宽度调整
                            const widthAfterScale = tmp_canvas.width - 512;
                            const remainder = widthAfterScale % 64;

                            // 判断余数接近0还是接近64
                            const adjustment = (remainder < 32) ? - remainder : (64 - remainder);
                            tmp_canvas.width += adjustment;
                        } else {
                            tmp_canvas.width = width
                            tmp_canvas.height = height
                            const widthAfterScale = tmp_canvas.width - 512;
                            const remainder = widthAfterScale % 64;
                            const adjustment = (remainder < 32) ? - remainder : (64 - remainder);
                            tmp_canvas.width += adjustment;
                            tmp_canvas.height += adjustment;
                        }

                        tmp_ctx.drawImage(image, 0, 0, width, height, 0, 0, tmp_canvas.width, tmp_canvas.height);

                        tmp_canvas.toBlob((blob) => {
                            if (blob) {
                                resolve(blob);
                            } else {
                                reject(new Error("Canvas to Blob conversion failed"));
                            }
                        });
                    };

                    image.onerror = (error) => {
                        reject(new Error("Image loading failed"));
                    };
                };

                reader.onerror = (error) => {
                    reject(new Error("File reading failed"));
                };

                reader.readAsDataURL(file);
            });
        },

        iSImageStatus(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const dataUrl = reader.result;
                    const img = new Image();
                    img.onload = () => {
                        const width = img.width;
                        const height = img.height;

                        if (width < 512 || height < 512) {
                            this.$message({
                                message: "❌ 图片宽高尺寸需要大于512 ❗",
                                type: '',
                            });
                            resolve({ isValid: false });
                        }
                        resolve({ isValid: true })
                    }
                    img.onerror = () => {
                        this.$message({
                            message: "❌ 图片文件无法加载，文件可能已损坏 ❗",
                            type: '',
                        });
                        resolve({ isValid: false })
                    };
                    img.src = dataUrl;
                };
                reader.readAsDataURL(file);
            })
        },
        async openDilog() {
            this.$set(this.currentTask, "loading", true);
            const fileName = this.currentTask.uploadedImage
                .split("/")
                .pop()
                .split(".")[0];
            await fetch(`/apiz/create-task/${fileName}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", // 设置请求头，表明发送的是 JSON 数据
                },
                body: JSON.stringify({
                    // 要发送的 JSON 数据对象
                    image_url: `${this.currentTask.uploadedImage}`,
                }),
            })
                .then((response) => response.json())
                .then(async (data) => {
                    if (data[0].msg !== '已存在任务') {
                        await getComputingPowerTotal()
                        store.dispatch("getComputingPower");
                    }
                    this.$set(this.currentTask, "fileName", data[0].data);
                    this.dialogVisible = true;
                })
                .catch((error) => {
                    this.$message({
                        message: "❌ 抠图失败,请稍后重试 ❗",
                        type: "",
                    });
                    this.$set(this.currentTask, "loading", false);
                    return
                });
        },
        openLoading() {
            this.$set(this.currentTask, "loading", false);
        },
        async closeDig(maskImage) {
            if (maskImage) {
                const fileImage = dataURLtoBlob(maskImage, Date.now() + ".png");

                const resizedImageBlob = await this.resizeImage(fileImage, 1024);

                const blob = await readFileAsBlob(resizedImageBlob);
                const newFile = new File([blob], resizedImageBlob.name, {
                    type: resizedImageBlob.type,
                });

                const formdata = new FormData();
                formdata.append("file", newFile);
                formdata.append("type", "2");

                const res = await upload(formdata);
                this.$set(this.currentTask, "maskImageSrc", res.url);
                update({ id: this.currentTask.id, mask: res.url });
            }
            this.dialogVisible = false;
        },
        openSelectFlag() {
            if (!this.currentTask.selectFlag) {
                this.$set(this.currentTask, 'selectFlag', false)
            }
            this.$set(this.currentTask, 'selectFlag', !this.currentTask.selectFlag)
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
                    this.currentTask.loading = null
                }
            }
        },
    }
}

//文件转base64
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

//base64 转文件
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
//图片地址转文件
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