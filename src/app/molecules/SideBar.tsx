/*
 * Copyright (C) 2018 Amsterdam University of Applied Sciences (AUAS)
 *
 * This software is distributed under the terms of the
 * GNU General Public Licence version 3 (GPL) version 3,
 * copied verbatim in the file "LICENSE"
 */

import * as m from 'mithril';
import NavItem from '../atoms/NavItem';
import { MithrilTsxComponent } from 'mithril-tsx-component';
import { selectIsSidebarShown } from '../redux/ducks/ui/selectors';
import { store } from '../redux/configureStore';

export default class SideBar extends MithrilTsxComponent<{}> {
    constructor() {
        super();
    }

    view() {
        return (
            // Sidebar
            <nav class={`jf-sidebar ${selectIsSidebarShown(store.getState()) ? '' : 'jf-sidebar-active'}`}>
                <ul class="list-unstyled components">
                    <NavItem href="/logs" name="Logs" />
                    <NavItem href="/runs" name="Runs" />
                    <NavItem href="/logs/create" name="Create new log" />
                    <NavItem href="/subsystems" name="Subsystems Overview" />
                </ul>
                <div class="jf-footer">Jiskefet v0.1.0</div>
            </nav>
        );
    }
}
