import React, { FC } from 'react'

export const IconCaret: FC<any> = ({ orientation, size }) => (
  <div data-testid="Tooltip">
    {orientation}
    {size}
  </div>
)
