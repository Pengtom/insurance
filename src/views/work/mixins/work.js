export default {
    data() {
        return {
            flag: true,
            images: [],
            hasMore: true,
            isSuccess: false
        }
    },
    methods: {
        handleOpen(newdata) {
            this.flag = !newdata;
        },
        handleOpenSuccess(newdata) {
            this.isSuccess = newdata;
        },
        loadMoreImages() {
            if (this.hasMore) {
                // 模拟加载更多图片
                setTimeout(() => {
                    // 加载更多图片的逻辑，例如从 API 获取更多数据
                    const newImages = [
                        "https://ai-image.weshop.com/2722ba48-a8e2-4e39-a80f-6dc994869147_776x1056.png_preview.webp",
                    ]; // 新加载的图片数据
                    if (newImages.length === 0) {
                        this.hasMore = false;
                    } else {
                        this.images = [...this.images, ...newImages];
                    }
                    console.log("111111");
                });
            }
        },
    },
}