import React from 'react';
import Loading from 'components/loading/loading';

import { connect } from 'react-redux';

/**
 * Component decorator to render a loading mask over another component while waiting for initial data retrieval
 *
 * @param  {Array}    preloadActions   Array of Redux actions to execute
 * @param  {...Function} connectArgs   mapStateToProps and mapPropsToDispatch, passed through to Redux.connect()
 * @return {Component}                 Wrapped React component
 */
export default (preloadActions, ...connectArgs) => {
    //For each preload, fire the appropriate action
    //Once all actions are complete, we are no longer loading
    let isLoading = !!preloadActions.length;

    return (Component) => {
        //connect() with no args injects dispatch()
        @connect()
        class ConnectWrapper extends React.Component {
            constructor() {
                super();
                this.state = {
                    isLoading
                };
            }

            async componentDidMount() {
                //Execute and await all preload dispatches
                const { dispatch } = this.props;
                for(const action of preloadActions) {
                    await dispatch(action);
                }
                this.setState({ isLoading: false });
            }

            render() {
                const Connected = connect(...connectArgs)(Component);
                return (
                    <div style={{position: 'relative'}}>
                        {this.state.isLoading ? <Loading /> : null}
                        <Connected {...this.props} />
                    </div>
                );
            }
        }

        return ConnectWrapper;
    }
}