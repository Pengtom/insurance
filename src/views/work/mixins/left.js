import { Loading } from 'element-ui';
import { upload, update, deleteTaskById } from '@/api/zhiqi/task'
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
            statusMap: {
                0: '未启动',
                1: '等待中',
                2: '已完成',
                3: '失败'
            }
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
        async deleteTask(taskId) {
            await deleteTaskById(taskId)
            this.tasks = this.tasks.filter(item => item.id !== taskId)
            this.init()
            // if (this.tasks.length === 0) {
            this.isDrawerVisible = false
            this.$emit('success', { isSuccess: false })
            // }
        },
        async openDrawer(taskId) {
            const task = this.tasks.find(task => task.id === taskId)
            console.log(task);
            if (!this.currentTask || Object.keys(this.currentTask).length === 0) {
                if (task.taskType === 1 || task.taskType === 2) {
                    this.$emit('success', {
                        id: taskId,
                        image: task.uploadedImage,
                        name: task.name,
                        isSuccess: true
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
                        isSuccess: true
                    })
                    this.currentTaskId = taskId;
                    this.isDrawerVisible = false;
                    return
                }
                console.log(this.currentTask);

                this.currentTaskId = taskId;
                this.isDrawerVisible = true;
                if (this.currentTask.fileName) {
                    return
                } else if (this.currentTask.maskImage) {
                    try {
                        const file = await getFileFromUrl(this.currentTask.uploadedImage, Date.now() + ".png")
                        this.$set(this.currentTask, 'loading', true);
                        const resizedImageBlob = await this.resizeImage(file, 1024);
                        console.log(resizedImageBlob);

                        const imageByteArray = await blobToByteArray(resizedImageBlob);

                        const form = new FormData();
                        form.append('image', new Blob([imageByteArray]), "image.png");
                        const task = this.currentTask;
                        await fetch('/apix/imagev2', {
                            method: "POST",
                            body: form
                        }).then((response) => response.json())
                            .then(async (data) => {
                                if (task) {
                                    await this.applyMask(this.currentTask.maskImage)
                                    this.$set(task, 'fileName', data.message);
                                }
                            }).catch(error => {
                                console.log(error);
                            })
                    } finally {
                        this.$set(this.currentTask, 'loading', false);
                    }
                }
            }
        },
        handleDrawerClose() {
            this.isDrawerVisible = false;
            this.currentTaskId = null; // 关闭抽屉不能再次选择同抽屉
        },
        async handleUpload(file) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/bmp', 'image/webp'];
            const isAllowedType = allowedTypes.includes(file.file.type);
            if (!isAllowedType) {
                this.$message({
                    message: "❌ 不允许上传此类型的文件 ❗",
                    type: '',
                });
                return;
            }
            const isLt5M = file.file.size / 1024 / 1024 < 5;
            if (!isLt5M) {
                this.$message({
                    message: "❌ 图片大小不能超过 5MB ❗",
                    type: '',
                });
                return;
            }
            const imageStatus = await this.iSImageStatus(file.file);
            console.log(imageStatus, "222");

            if (!imageStatus.isValid) {
                const fileList = this.currentTask.fileList.filter(f => f.uid !== file.file.uid);
                this.$set(this.currentTask, 'fileList', fileList);
                return;
            }
            this.$set(this.currentTask, 'uploading', this.currentTaskId)

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
            this.$set(task, 'uploadedImage', res.url);
            this.$set(task, "fileList", newFile)
            this.$set(task, "clickCoordinates", [])
            this.$set(task, "type", [])
            this.$set(this.currentTask, 'loading', true);
        },
        // resizeImage(file, targetHeight) {
        //     return new Promise((resolve, reject) => {
        //         // 创建 FileReader 对象读取文件内容
        //         const reader = new FileReader();

        //         // 当文件读取成功时
        //         reader.onload = (event) => {
        //             const image = new Image();
        //             image.src = event.target.result;

        //             image.onload = () => {
        //                 // 创建临时画布以保持缩放后的图像
        //                 const tmp_canvas = document.createElement('canvas');
        //                 const tmp_ctx = tmp_canvas.getContext('2d');

        //                 // 计算缩放因子
        //                 let scaleFactor = 1;
        //                 if (image.height > targetHeight) {
        //                     scaleFactor = targetHeight / image.height;
        //                 }

        //                 // 计算缩放后的宽度和高度
        //                 const scaledWidth = image.width * scaleFactor;
        //                 const scaledHeight = image.height * scaleFactor;

        //                 // 设置画布的大小
        //                 tmp_canvas.width = scaledWidth;
        //                 tmp_canvas.height = scaledHeight;

        //                 // 绘制缩放后的图像到画布上
        //                 tmp_ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, scaledWidth, scaledHeight);

        //                 // 将画布内容转换为 Blob
        //                 tmp_canvas.toBlob((blob) => {
        //                     if (blob) {
        //                         resolve(blob);
        //                     } else {
        //                         reject(new Error("Canvas to Blob conversion failed"));
        //                     }
        //                 });
        //             };

        //             // 处理图像加载错误
        //             image.onerror = (error) => {
        //                 reject(new Error("Image loading failed"));
        //             };
        //         };

        //         // 处理文件读取错误
        //         reader.onerror = (error) => {
        //             reject(new Error("File reading failed"));
        //         };

        //         // 读取文件为 Data URL
        //         reader.readAsDataURL(file);
        //     });
        // },
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
        getImageClickCoordinates(event) {
            event.preventDefault()
            // if (this.currentTask.clickCoordinates) {
            //     if (this.currentTask.clickCoordinates.length > 30) {
            //         this.$message({
            //             message: "❌ 点击次数太多 ❗",
            //             type: '',
            //         });
            //         return;
            //     }
            // } else {
            //     this.$set(this.currentTask, "clickCoordinates", [])
            //     this.$set(this.currentTask, "type", [])
            // }
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
        },
        async dialogclose() {
            const fileName = Date.now()
            const urlPattern = /^(https?:\/\/[^\s]+)$/;
            if (!this.currentTask.maskImage) {
                this.dialogVisible = false
                return
            }
            let fileImg = null
            if (urlPattern.test(this.currentTask.maskImage)) {
                fileImg = await getFileFromUrl(this.currentTask.maskImage, fileName + '.png')
            } else {
                fileImg = dataURLtoBlob(this.currentTask.maskImage, fileName + '.png')
            }
            console.log(fileImg, "====================");

            const formdata = new FormData()
            formdata.append("file", fileImg)
            formdata.append("type", "1")
            const [res, res1] = await Promise.all([
                upload(formdata),
                (async () => {
                    const fileSrc = dataURLtoBlob(this.currentTask.maskImageSrc);
                    const formdataSrc = new FormData();
                    formdataSrc.append("file", fileSrc);
                    formdataSrc.append("type", "2");
                    return await upload(formdataSrc);
                })()
            ]);
            const qzProject = {
                id: this.currentTask.id,
                primaryImage: this.currentTask.uploadedImage,
                maskImage: res.url,
                mask: res1.url
            }
            console.log(qzProject);
            update(qzProject)
            this.dialogVisible = false
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
}
async function blobToByteArray(blob) {
    return new Uint8Array(await new Response(blob).arrayBuffer());
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