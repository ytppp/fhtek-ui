import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import Icon from './icon.vue'

describe('Icon', () => {
  it('renders properly', () => {
    const wrapper = mount(Icon, {
      props: { name: 'icon-name', hoverName: 'icon-hover-name', title: 'Hello Vitest' },
    })
    expect(wrapper.text()).toContain('Hello Vitest')
  })
})
