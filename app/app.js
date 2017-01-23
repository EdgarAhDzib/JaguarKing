var React = require("react");
var ReactDOM = require("react-dom");
var PlayField = require("./components/board/PlayField");

import { Provider } from "react-redux"

//import routes from '../config/routes'
import store from "./store"

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