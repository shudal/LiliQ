
<view class="cu-form-group margin-top">
    <view class="title">分类</view>
    <picker bindchange="PickerChange" value="{{pickerindex}}" range="{{picker}}">
        <view class="picker">
            {{pickerindex != null ?picker[pickerindex]:'课程'}}
        </view>
    </picker>
</view>

<view class="cu-form-group margin-top" wx:if="{{ showTypeCourse }}">
    <view class="title">年级</view>
    <picker bindchange="PickerYearChange" value="{{pickeryearindex}}" range="{{pickeryear}}">
        <view class="picker">
            {{pickeryearindex != null ?pickeryear[pickeryearindex]:'2019'}}
        </view>
    </picker>
</view>

<view class="cu-form-group" wx:if="{{ showTypeCourse }}">
    <view class="title">课程名称</view>
    <input placeholder="不限" data-field="coursename" bindinput="formInputChange" ></input>
</view>
<view class="cu-form-group" wx:if="{{ showTypeCourse }}"  >
    <view class="title">任课教师</view>
    <input placeholder="不限" data-field="teacher" bindinput="formInputChange"></input>
</view>

<view class="cu-form-group">
    <view class="title">内容</view>
    <input data-field="content" bindinput="formInputChange" placeholder="输入关键字趴~"></input>
</view>

<view class="padding flex flex-direction">
    <button class="cu-btn bg-grey lg" bindtap="mySubmit">搜索</button> 
</view> 
  