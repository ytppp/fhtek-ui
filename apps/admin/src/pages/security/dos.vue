<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0055') }}</h1>
    </div>
    <div class="page__content">
      <fh-form class="form" :model="dosForm" :disabled="isCustom" label-width="300px" v-if="firewallEnable">
        <fh-form-item :label="$t('trans0115')">
          <fh-switch v-model="dosForm.syn_flood_protect"> </fh-switch>
        </fh-form-item>
        <fh-form-item :label="$t('trans0153')">
          <fh-switch v-model="dosForm.icmp_echo_protect"> </fh-switch>
        </fh-form-item>
        <fh-form-item :label="$t('trans0455')">
          <fh-switch v-model="dosForm.icmp_redirect_protect"> </fh-switch>
        </fh-form-item>
        <fh-form-item :label="$t('trans0603')">
          <fh-switch v-model="dosForm.land_protect"> </fh-switch>
        </fh-form-item>
        <fh-form-item :label="$t('trans0608')">
          <fh-switch v-model="dosForm.smurf_protect"> </fh-switch>
        </fh-form-item>
        <fh-form-item :label="$t('trans0842')">
          <fh-switch v-model="dosForm.winnuke_protect"> </fh-switch>
        </fh-form-item>
        <fh-form-item :label="$t('trans0843')">
          <fh-switch v-model="dosForm.ping_sweep_protect"> </fh-switch>
        </fh-form-item>
        <fh-form-item class="form__submit-btn">
          <fh-button @click="save" block>
            {{ $t('trans0002') }}
          </fh-button>
        </fh-form-item>
      </fh-form>
      <div style="padding-left: 20px; font-size: 16px" v-else>
        {{ $t('trans0844') }}
      </div>
    </div>
  </div>
</template>

<script>
import { setFirewall, getFirewall } from '@/http/api'
import { useDataClean } from '@/hooks/data-clean'

const { convertBooleanStatus } = useDataClean()
export default {
  name: 'DosPage',
  data() {
    return {
      firewallEnable: false,
      isCustom: false,
      dosForm: {
        syn_flood_protect: false,
        icmp_echo_protect: false,
        icmp_redirect_protect: false,
        land_protect: false,
        smurf_protect: false,
        winnuke_protect: false,
        ping_sweep_protect: false,
      },
    }
  },
  methods: {
    save() {
      setFirewall({
        syn_flood_protect: convertBooleanStatus(this.dosForm.syn_flood_protect),
        icmp_echo_protect: convertBooleanStatus(this.dosForm.icmp_echo_protect),
        icmp_redirect_protect: convertBooleanStatus(this.dosForm.icmp_redirect_protect),
        land_protect: convertBooleanStatus(this.dosForm.land_protect),
        smurf_protect: convertBooleanStatus(this.dosForm.smurf_protect),
        winnuke_protect: convertBooleanStatus(this.dosForm.winnuke_protect),
        ping_sweep_protect: convertBooleanStatus(this.dosForm.ping_sweep_protect),
      }).then(() => {
        successTips()
      })
    },
    getFirewallData() {
      getFirewall().then(({ data }) => {
        const {
          enable,
          custom,
          syn_flood_protect,
          icmp_echo_protect,
          icmp_redirect_protect,
          land_protect,
          smurf_protect,
          winnuke_protect,
          ping_sweep_protect,
        } = data
        this.firewallEnable = convertBooleanStatus(enable)
        this.isCustom = !convertBooleanStatus(custom)
        this.dosForm = {
          syn_flood_protect: convertBooleanStatus(syn_flood_protect),
          icmp_echo_protect: convertBooleanStatus(icmp_echo_protect),
          icmp_redirect_protect: convertBooleanStatus(icmp_redirect_protect),
          land_protect: convertBooleanStatus(land_protect),
          smurf_protect: convertBooleanStatus(smurf_protect),
          winnuke_protect: convertBooleanStatus(winnuke_protect),
          ping_sweep_protect: convertBooleanStatus(ping_sweep_protect),
        }
      })
    },
  },
  created() {
    this.getFirewallData()
  },
}
</script>
