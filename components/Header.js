import React from 'react';
import { MenuMenu, MenuItem, Menu } from 'semantic-ui-react';

export default function Header() {
  return (
    <Menu style={{ marginTop: '10px' }}>
      <MenuItem>CrownCoin</MenuItem>

      <MenuMenu position="right">
        <MenuItem>Campagins</MenuItem>
        <MenuItem>+</MenuItem>
      </MenuMenu>
    </Menu>
  );
}
