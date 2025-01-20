'use client'

import { StyleProvider } from '@ant-design/cssinjs'
import { AntdRegistry } from "@ant-design/nextjs-registry"

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
      <AntdRegistry>
          <StyleProvider layer>
              {children}
          </StyleProvider>
      </AntdRegistry>
  )
}