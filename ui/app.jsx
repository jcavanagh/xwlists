import React from 'react';
import { Link } from 'react-router'
import styled from 'styled-components';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import {Tabs, Tab} from 'material-ui/Tabs';

import theme from './theme';

const AppRoot = styled.div`
    min-height: 100vh;
    background-image: linear-gradient(-180deg, #FCFCFC 0%, #EAEAEA 100%);
`;

const Content = styled.div`
    height: 100%;
    padding: 20px;
`;

const TopBarContainer = styled.div`
    display: flex;
`;

const Spacer = styled.span`
    flex-grow: 1;
`;

const Title = styled.span`
    font-weight: 300
`;

const SmallTitle = styled(Title)`
    font-size: 16px;
`;

const TitleIcon = styled(Paper)`
  height: 40px;
  width: 40px;
  margin: 12px 20px 0px 20px;
  padding: 5px;
  textAlign: center;
  vertical-align: middle;
  display: inline-block;
  overflow: hidden;
`;

const IconImage = styled.div`
    background-image: ${({src}) => `url(${src})`};
    background-size: cover;
    image-rendering: -webkit-optimize-contrast;
    width: 30px;
    height: 30px;
`;

const FlexLink = styled.a`
    display: flex;
    color: inherit;
`;

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
