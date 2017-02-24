import React from 'react';
import { Link } from 'react-router'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import {Tabs, Tab} from 'material-ui/Tabs';

import theme from './theme';

import { AppRoot, Content, TopBarContainer, Spacer, Title, SmallTitle, TitleIcon, IconImage, FlexLink } from './styles';

const TopBar = (
    <TopBarContainer>
        <Title>{'X-Wing List Juggler'}</Title>
        <Spacer />
        <FlexLink href="https://www.patreon.com/scumandvillainy" target="_blank">
            <TitleIcon zDepth={2} circle={true}>
                <IconImage alt="Scum and Villainy Podcat Patreon" src="/img/patreon.svg" />
            </TitleIcon>
            <SmallTitle>{"Hosted by the Scum and Villainy Podcast"}</SmallTitle>
        </FlexLink>
    </TopBarContainer>
);

class NavBar extends React.Component {
    navigate = (url) => {
        this.props.router.push(url)
    }

    render() {
        return (
            <Tabs initialSelectedIndex={this.props.selected}>
                {this.props.items.map((item, n) => (
                    <Tab key={n} label={item.title} onActive={() => this.navigate(item.url)} />
                ))}
            </Tabs>
        );
    }
};

const navItems = [{
    title: 'Add a Tourney',
    url: '/new'
},{
    title: 'Search Lists',
    url: '/search'
},{
    title: 'Browse Tourneys',
    url: '/tourneys'
},{
    title: 'Charts',
    url: '/time_series'
},{
    title: 'World Heatmap',
    url: '/heatmap'
},{
    title: 'Vassal League',
    url: '/league'
},{
    title: 'Meta Analyzer',
    url: 'http://meta-wing.com'
},{
    title: 'Download Cryodex',
    url: 'https://github.com/Killerardvark/CryodexSource/blob/master/Cryodex.jar?raw=true'
},{
    title: 'About',
    url: '/about'
}];

export default class App extends React.Component {
    render() {
        const selectedTabIndex = navItems.findIndex(item => this.props.router.location.pathname.indexOf(item.url) === 0);

        return (
            <MuiThemeProvider muiTheme={theme}>
                <AppRoot>
                    <AppBar title={TopBar} iconElementLeft={<div/>} />
                    <NavBar router={this.props.router} items={navItems} selected={selectedTabIndex} />
                    <Content>
                        {this.props.children}
                    </Content>
                </AppRoot>
            </MuiThemeProvider>
        );
    }
}
