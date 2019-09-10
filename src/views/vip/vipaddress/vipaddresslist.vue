<template>
  <div class="vip-address-container">
    <div>
      <search-group></search-group>
    </div>
    <el-table border stripe :data="addressList" class="data-list">
      <el-table-column type="index" :index="1"></el-table-column>
      <el-table-column label="客户ID" prop="id"></el-table-column>
      <el-table-column label="收件人" prop="recipect"></el-table-column>
      <el-table-column label="联系电话" prop="mobile"></el-table-column>
      <el-table-column label="国家" prop="country"></el-table-column>
      <el-table-column label="城市" prop="city"></el-table-column>
      <el-table-column label="街道" prop="street"></el-table-column>
      <el-table-column label="门牌号" prop="door_no"></el-table-column>
      <el-table-column label="邮编" prop="postcode"></el-table-column>
    </el-table>
    <nle-pagination :pageParams="page_params"></nle-pagination>
  </div>
</template>
<script>
import { SearchGroup } from '@/components/searchs'
import NlePagination from '@/components/pagination'
import { pagination } from '@/mixin'
export default {
  data () {
    return {
      addressList: [
        {
          id: '901234',
          recipect: 'Super_Admin',
          mobile: '0031-123456789',
          country: '荷兰',
          city: 'Amstelveen',
          street: 'Straat van Gibraltar',
          door_no: '11',
          postcode: '1183gt'
        }
      ]
    }
  },
  components: {
    SearchGroup,
    NlePagination
  },
  mixins: [pagination]
}
</script>
