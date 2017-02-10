var React = require("react");
var ReactDOM = require("react-dom");
import PlayField from "./components/board/PlayField";
import routes from "./config/routes";

import { Provider } from "react-redux"
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

//import routes from '../config/routes'
import store from "./store"

ReactDOM.render(
  <Provider store={store}>
    {routes}
  </Provider>,
document.getElementById('app'));


store.subscribe(() => {
	console.log(store.getState());
})

/*
var App = React.createClass({

	render: function() {
		return (
			<Provider store={store}>
				<PlayField />
			</Provider>
			)
	}
});

ReactDOM.render(<App />, document.getElementById("app"));
*/