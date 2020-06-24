<form>
    <view class="cu-form-group">
		<view class="title">昵称</view>
		<input data-field="nickname" bindinput="formInputChange" placeholder="{{userInfo == null ? '佚名' : userInfo.nickName }}"></input>
	</view>
	<!--
	<view class="cu-form-group">
		<view class="title">允许ta人添加我为好友</view>
		<switch class="orange radius sm" bindchange="switchange"></switch>
	</view>
	-->
	
	<view class="cu-form-group margin-top" >
		<view class="title">普通</view>
		<switch bindchange="switchLove" checked="{{ switchloveChecked }}"></switch>
	</view>
	<view class="cu-form-group margin-top" wx:if="{{ showType }}">
		<view class="title">分类</view>
		<picker bindchange="PickerChange" value="{{pickerindex}}" range="{{picker}}">
			<view class="picker">
				{{pickerindex?picker[pickerindex]:'课程'}}
			</view>
		</picker>
	</view>
	<view class="cu-form-group margin-top" wx:if="{{ showTypeCourse }}">
		<view class="title">年级</view>
		<picker bindchange="PickerYearChange" value="{{pickeryearindex}}" range="{{pickeryear}}">
			<view class="picker">
				{{pickeryearindex?pickeryear[pickeryearindex]:'2019'}}
			</view>
		</picker>
	</view>
	
	<view class="cu-form-group" wx:if="{{ showTypeCourse }}">
		<view class="title">课程名称</view>
		<input placeholder="OvO" data-field="coursename" bindinput="formInputChange" ></input>
	</view>
	<view class="cu-form-group" wx:if="{{ showTypeCourse }}"  >
		<view class="title">任课教师</view>
		<input placeholder="OvO" data-field="teacher" bindinput="formInputChange"></input>
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
		<textarea maxlength="-1" disabled="{{modalName!=null}}" data-field="content" bindinput="formInputChange"  placeholder="我一句话也不说~"></textarea>
	</view>
	
	<view class="padding flex flex-direction">
  		<button class="cu-btn bg-grey lg" bindtap="mySubmit">发布</button> 
	</view> 
</form>