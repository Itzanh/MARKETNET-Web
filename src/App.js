/*
This file is part of MARKETNET.

MARKETNET is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.

MARKETNET is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with MARKETNET. If not, see <https://www.gnu.org/licenses/>.
*/

import splashScreen from './IMG/splash_screen.svg'
import './App.css';

function App() {
    return (<div id="splashScreen">
        <img src={splashScreen} alt="MARKETNET" />
    </div>);
}

export default App;
