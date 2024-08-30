<template>
  <div class="task-wrapper">
    <div class="task-content">
      <div class="task-header">
        <div class="task-header-inner">
          <img
            src="https://ai-image.weshop.com/810e0924-b022-491b-9086-7739ea67709f_1024x1024.png_150x150.jpeg"
            alt=""
            width="54"
            height="54"
            class="task-image"
          />
          <div class="task-info-wrapper">
            <div class="task-title">
              <div>任务-33868118</div>
            </div>
          </div>
        </div>
        <div style="width: 100%">
          <div class="task-details">
            <div class="task-details-inner">
              <div class="task-info">
                <div class="task-info-inner">
                  <div class="task-info-content">
                    <div class="task-info-content-inner">
                      <img
                        src="https://ai-image.weshop.com/71bf8823-5df5-4cab-b008-9a3d7387f4c2_1200x1200.png"
                        width="26"
                        height="26"
                        class="task-info-image"
                      />
                      <div
                        class="task-assignee"
                        style="padding-left: 19px !important"
                      >
                        波莉娜
                      </div>
                      <div class="task-assignee">自由发挥</div>
                      <div class="task-assignee">巷子</div>
                    </div>
                  </div>
                </div>
                <!-- <div>
                    <div>
                      <img
                        src="https://www.weshop.com/edit_again.svg"
                        width="14"
                        height="14"
                      />
                      <span>再次编辑</span>
                    </div>
                  </div> -->
                <div class="task-status">
                  <span style="margin-right: 10px">执行成功</span>
                  <span style="margin-left: 10px">2024-08-08 11:33:19</span>
                </div>
              </div>
              <div>
                <div class="image-container">
                  <div>
                    <div class="image-content">
                      <div class="image-content-inner">
                        <div class="image-final" style="width: 252px">
                          <img
                            src="https://ai-image.weshop.com/061121a2-4c75-40b2-a8f5-4737d4e2fe45_1024x1024.png_preview.webp"
                            width="252"
                            class="image-src"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
.task-wrapper {
  height: 100%;
  background-color: #fff;
  position: relative;
}
.task-content {
  width: 100%;
  height: 100%;
}
.task-header {
  width: 100%;
  height: 100%;
  overflow: scroll;
  min-width: 584px;
}
.task-header-inner {
  position: sticky;
  min-height: 90px;
  width: 100%;
  display: flex;
  align-items: center;
  background-color: #fff;
  padding: 18px 30px;
  top: 0;
  border-bottom: 1px solid #e3e3e3;
  z-index: 50;
}
.task-image {
  border-radius: 8px;
  object-fit: cover;
  margin-right: 18px;
}
.task-info-wrapper {
  display: flex;
  justify-content: left;
  flex-direction: column;
}
.task-title {
  display: flex;
  align-items: center;
  color: #333;
  font-weight: 500;
  font-size: 18px;
  line-height: 25px;
}
.task-details {
  width: 100%;
  max-width: 1136px;
  padding-bottom: 180px;
  padding-top: 10px;
}
.task-details-inner {
  padding-top: 30px;
  padding-left: 20px;
}
.task-info {
  width: 100%;
  padding-left: 8px;
  padding-right: 30px;
}
.task-info-inner {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  gap: 20px 0;
}
.task-info-content {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px 0;
}
.task-info-content-inner {
  display: flex;
  align-items: center;
}
.task-info-image {
  margin-right: -13px;
  z-index: 1;
  border-radius: 50%;
  display: inline-block;
  object-fit: cover;
}
.task-assignee {
  background-color: #f5f7fd;
  border-radius: 6px;
  padding: 3px 10px;
  color: #333;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 8px;
  font-size: 14px;
  line-height: 20px;
}
.task-status {
  color: #b8b2b2;
  margin-top: 6px;
  margin-bottom: 10px;
  font-size: 14px;
  line-height: 20px;
}
.image-container {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  position: relative;
}
.image-content {
  width: 252px;
  border-radius: 20px;
  margin: 10px;
  position: relative;
}
.image-content-inner {
  position: relative;
  width: 252px;
  background-color: #f5f7fd;
  border-radius: 20px;
}
.image-final {
  position: relative;
  display: inline-block;
  font-size: 14px;
  box-sizing: border-box;
}
.image-src {
  width: 100%;
  height: auto;
  vertical-align: middle;
  border-radius: 20px;
}
</style>