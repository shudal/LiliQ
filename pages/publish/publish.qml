<form>
    <view class="cu-form-group">
		<view class="title">昵称</view>
		<input data-field="nickname" bindinput="formInputChange" placeholder="{{userInfo == null ? '佚名' : userInfo.nickName }}"></input>
	</view>
    <view class="cu-bar bg-white margin-top">
		<view class="action">
			图片上传
		</view>
		<view class="action">
			{{imgList.length}}/{{ maxPicLength }}
		</view>
	</view>
	<view class="cu-form-group">
		<view class="grid col-4 grid-square flex-sub">
			<view class="bg-img" wx:for="{{imgList}}" wx:key="{{index}}" bindtap="ViewImage" data-url="{{imgList[index]}}">
				<image src='{{imgList[index]}}' mode='aspectFill'></image>
				<view class="cu-tag bg-red" catchtap="DelImg" data-index="{{index}}">
					<text class="cuIcon-close"></text>
				</view>
			</view>
			<view class="solids" bindtap="ChooseImage" wx:if="{{imgList.length<maxPicLength}}">
				<text class="cuIcon-cameraadd"></text>
			</view>
		</view>
	</view>
    <view class="cu-form-group margin-top">
		<textarea maxlength="-1" disabled="{{modalName!=null}}" data-field="content" bindinput="formInputChange"  placeholder="内容"></textarea>
	</view>
	
	<view class="padding flex flex-direction">
  		<button class="cu-btn bg-grey lg" bindtap="mySubmit">发布</button> 
	</view> 
</form>