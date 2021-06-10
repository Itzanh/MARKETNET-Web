import splashScreen from './../IMG/splash_screen.svg';
import { Component } from 'react';

class ErrorScreen extends Component {
    constructor({ errorTitle, errorDescription }) {
        super();

        this.errorTitle = errorTitle;
        this.errorDescription = errorDescription;
    }

    render() {
        return <div id="errorScreen">
            <img src={splashScreen} alt="" />
            <h1>{this.errorTitle}</h1>
            <p>{this.errorDescription}</p>
        </div>;
    }
}

export default ErrorScreen;
