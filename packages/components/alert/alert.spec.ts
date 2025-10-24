import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import Alert from './alert.vue'

describe('Alert', () => {
  it('renders properly', () => {
    const wrapper = mount(Alert, {
      props: {
        title: 'Hello Vitest',
        type: 'info',
        closable: false,
        center: false,
        showIcon: true,
        effect: 'light',
      },
    })
    expect(wrapper.text()).toContain('Hello Vitest')
  })
})
