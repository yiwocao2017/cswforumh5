import React, {Component} from 'react';
import NavLink from './NavLink';
import './index.scss';

const Util = require('../../util/util');

export default class Nav extends Component {

    render() {
        let {menuData, activeIndex, chatRoomData} = this.props;
        return (
            <div>
                {
                    menuData.length ?
                    (
                        <ul class="nav">
                            <NavLink chatRoomData={chatRoomData} key="nav0" navIndex={0} navUrl='/home' icoUrl={menuData[0].pic} active={activeIndex == "0" ? true : false} linkName={menuData[0].name}/>
                            <NavLink chatRoomData={chatRoomData} key="nav1" navIndex={1} navUrl='/rich' icoUrl={menuData[1].pic} active={activeIndex == "1" ? true : false} linkName={menuData[1].name}/>
                            <NavLink chatRoomData={chatRoomData} key="nav2" navIndex={2} navUrl='/write' icoUrl={menuData[2].pic} imgClass="bee" active={activeIndex == "2" ? true : false} linkName={menuData[2].name}/>
                            <NavLink chatRoomData={chatRoomData} key="nav3" navIndex={3} navUrl='/video' icoUrl={menuData[3].pic} active={activeIndex == "3" ? true : false} linkName={menuData[3].name}/>
                            <NavLink chatRoomData={chatRoomData} key="nav4" navIndex={4} navUrl='/user' icoUrl={menuData[4].pic} active={activeIndex == "4" ? true : false} linkName={menuData[4].name}/>
                        </ul>
                    ) : ""
                }
            </div>
        )
    }
}
