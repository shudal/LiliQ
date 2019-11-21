<view class="cu-card dynamic {{isCard?'no-card':''}}" wx:for="{{ posts }}">
  <view class="cu-item shadow">
    <view class="cu-list menu-avatar">
      <view class="cu-item">
        <view class="cu-avatar round lg" style="background-image:url('{{ avas[item.userid] }}');" wx:if="{{ avas[item.userid] != null }}"></view>
        <view wx:else class="cu-avatar lg round  bg-grey">{{ item.nickname[0] }}</view>
        <view class="content flex-sub">
          <view>{{ item.nickname }}
            <view style="padding-left: 3px">
              <text class="cuIcon-{{ item.gender == 1 ? 'male' : 'female' }} lg text-gray"></text>
           </view>
          </view> 
          <view class="text-gray text-sm flex justify-between"> {{ item.cretime }}  
          </view>
        </view>
      </view>
    </view>
    <view class="text-content">
     {{ item.content }}
    </view>
    <view class="grid flex-sub padding-lr {{isCard?'col-3 grid-square':'col-1'}}">
      <view class="bg-img {{isCard?'':'only-img'}}"  wx:for="{{ item.rimg }}" wx:for-item="aPicIndex" style="background-image:url('{{ imgs[aPicIndex] }}');">
      </view>
    </view>
    <view class="text-gray text-sm text-right padding">
      <text class="cuIcon-attentionfill margin-lr-xs"></text> {{ item.rvol }}
      <text class="cuIcon-appreciatefill margin-lr-xs" bindtap="inc" data-field="gvol" data-id="{{ item.id }}"></text> {{ item.gvol }}
      <text class="cuIcon-messagefill margin-lr-xs" bindtap="showDetail" data-id="{{ item.id }}"></text> {{ item.cvol }}
    </view>
  </view>
</view> 

<view class="cu-list menu-avatar comment solids-top" style="padding-bottom:90rpx">
      <view class="cu-item" wx:for="{{ comments }}">
        <view class="cu-avatar round" style="background-image:url(' {{ avas[item.userid] }}');"></view>
        <view class="content">
          <view class="text-grey">{{ item.nickname }}</view>
          <view class="text-gray text-content text-df">
            {{ item.content }}
          </view>
          <view class="margin-top-sm flex justify-between">
            <view class="text-gray text-df">{{ item.cretime }} #{{item.index}}</view>
            <view  class="text-gray text-sm text-right padding-right">
              <text class="cuIcon-appreciatefill margin-lr-xs" bindtap="incComment" data-field="gvol" data-id="{{ item.id }}"></text>{{ item.gvol }} 
            </view>
          </view>
        </view>
      </view> 
    </view>

  



<view class="cu-bar foot input {{InputBottom!=0?'cur':''}}" style="bottom:{{InputBottom}}px"> 
  <input class="solid-bottom" bindfocus="InputFocus" bindblur="InputBlur" adjust-position="{{false}}" focus="{{false}}" maxlength="300" cursor-spacing="10" placeholder="想说些什么呀" data-field="content" bindinput="formInputChange"></input> 
  <button class="cu-btn bg-green shadow" bindtap="mySubmit">发送</button>
</view>