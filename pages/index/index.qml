<view class="cu-card dynamic {{isCard?'no-card':''}}" wx:for="{{ posts }}">
  <view class="cu-item shadow">
    <view class="cu-list menu-avatar">
      <view class="cu-item">
        <view class="cu-avatar round lg" style="background-image:url('{{ avas[item.userid] }}');"></view>
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
      <text class="cuIcon-attentionfill margin-lr-xs"></text> 10
      <text class="cuIcon-appreciatefill margin-lr-xs"></text> 20
      <text class="cuIcon-messagefill margin-lr-xs"></text> 30
    </view>
  </view>
</view>
<view wx:if="{{ showedAll }}" class="cu-load bg-grey over"></view>

