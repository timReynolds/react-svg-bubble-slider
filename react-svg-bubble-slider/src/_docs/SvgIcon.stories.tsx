import React from 'react'
import { SvgIcon } from '../components/SvgIcon'

import { Flex, Box } from 'theme-ui'

export default {
  title: 'SvgIcon',
  decorators: [
    (storyFn: any) => {
      return (
        <Flex
          sx={{
            textAlign: 'center',
          }}
        >
          <Box
            sx={{
              width: '100%',
            }}
          >
            {storyFn()}
          </Box>
        </Flex>
      )
    },
  ],
  parameters: {
    component: SvgIcon,
    componentSubtitle:
      "If you'd like to use the icons in isolation you can do so by using the SvgIcon component and passing it a name",
  },
}

export const usage = () => <SvgIcon name="wondering" />

export const size = () => <SvgIcon name="wondering" size={64} />

size.story = {
  parameters: {
    docs: {
      storyDescription:
        'The `size` prop can be used to change the size of the `SvgIcon`',
    },
  },
}

export const color = () => <SvgIcon name="wondering" color="#8be9fd" />

color.story = {
  parameters: {
    docs: {
      storyDescription:
        'The `color` prop can be used to change the color of the `SvgIcon`',
    },
  },
}

export const ThemeUI = () => (
  <Box
    sx={{
      '.svg-icon': {
        color: 'muted',
      },
    }}
  >
    <SvgIcon name="wondering" />
  </Box>
)

ThemeUI.story = {
  parameters: {
    docs: {
      storyDescription:
        "If you're using Theme UI modify styles by referencing them by class name via the sx prop on a Theme UI enabled element",
    },
  },
}
