/*
This file is part of MARKETNET.

MARKETNET is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.

MARKETNET is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with MARKETNET. If not, see <https://www.gnu.org/licenses/>.
*/

import i18next from 'i18next';
import { Component } from 'react';

class SecureCloudEvaluation extends Component {
    constructor({ evaluation }) {
        super();

        this.evaluation = evaluation;
    }

    render() {
        return <div>
            <h3>SecureCloud</h3>
            <p>{i18next.t('password-complexity')}: {this.evaluation != null ? this.evaluation.passwordComplexity == true ? i18next.t('ok') :
                (this.evaluation.passwordComplexity == false ? i18next.t('error') : '-') : '-'}</p>
            <p>{i18next.t('passwords-blacklist')}: {this.evaluation != null ? this.evaluation.passwordInBlacklist == true ? i18next.t('error') :
                (this.evaluation.passwordInBlacklist == false ? i18next.t('ok') : '-') : '-'}</p>
            <p>{i18next.t('passwords-dumped')}: {this.evaluation != null ? this.evaluation.passwordHashInBlacklist == true ? i18next.t('error') :
                (this.evaluation.passwordHashInBlacklist == false ? i18next.t('ok') : '-') : '-'}</p>
        </div>
    }
}

export default SecureCloudEvaluation;
