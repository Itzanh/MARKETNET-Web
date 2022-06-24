/*
This file is part of MARKETNET.

MARKETNET is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.

MARKETNET is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with MARKETNET. If not, see <https://www.gnu.org/licenses/>.
*/

import splashScreen from './../IMG/splash_screen.svg';
import { Component } from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';

// IMG
import SignalCellularConnectedNoInternet0BarIcon from '@material-ui/icons/SignalCellularConnectedNoInternet0Bar';
import googleAuthenticatorIco from './../IMG/google_authenticator.png';
import StorageIcon from '@material-ui/icons/Storage';



class ErrorScreen extends Component {
    constructor({ errorTitle, errorDescription, extraData, image }) {
        super();

        this.errorTitle = errorTitle;
        this.errorDescription = errorDescription;
        this.extraData = extraData;
        this.image = image;
    }

    render() {
        return <div id="errorScreen" className="formRowRoot">
            <div id="errorScreenHeaderBar">
                <div id="errorScreenHeader">
                    <img src={splashScreen} alt="" />
                </div>
            </div>
            <div class="form-row">
                <div class="col">
                    {(this.image == 1) || (this.image == 2) || (this.image == 5) || (this.image == 4) ? <SvgIcon style={{
                        "color": "white", "width": "75%", "height": "75%", "display": "block", "margin-left": "auto", "margin-right": "auto"
                    }}>
                        {this.image == 1 ? <SignalCellularConnectedNoInternet0BarIcon /> : null}
                        {this.image == 5 ? <StorageIcon /> : null}
                        {this.image == 4 ? <path d="M2 17h20v2H2v-2zm1.15-4.05L4 11.47l.85 1.48 1.3-.75-.85-1.48H7v-1.5H5.3l.85-1.47L4.85 7 4 8.47 3.15 7l-1.3.75.85 1.47H1v1.5h1.7l-.85 1.48 1.3.75zm6.7-.75 1.3.75.85-1.48.85 1.48 1.3-.75-.85-1.48H15v-1.5h-1.7l.85-1.47-1.3-.75L12 8.47 11.15 7l-1.3.75.85 1.47H9v1.5h1.7l-.85 1.48zM23 9.22h-1.7l.85-1.47-1.3-.75L20 8.47 19.15 7l-1.3.75.85 1.47H17v1.5h1.7l-.85 1.48 1.3.75.85-1.48.85 1.48 1.3-.75-.85-1.48H23v-1.5z"></path> : null}
                    </SvgIcon> : null}

                    {this.image == 3 ? <img src={googleAuthenticatorIco} alt="groups" className="errorImage" /> : null}
                </div>
                <div class="col">
                    <h1>{this.errorTitle}</h1>
                    <p>{this.errorDescription}</p>
                    <br />
                    <p>{this.extraData}</p>
                </div>
            </div>
        </div>;
    }
}

export default ErrorScreen;
