import { Component } from "react";
import i18next from 'i18next';

import splashScreen from './../../../IMG/splash_screen.svg';
import "./../../../CSS/about.css"

class About extends Component {
    constructor({ }) {
        super();
    }

    componentDidMount() {
        window.$('#aboutModal').modal({ show: true });
    }

    render() {
        return <div class="modal fade" id="aboutModal" tabindex="-1" role="dialog" aria-labelledby="aboutModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="aboutModalLabel">{i18next.t('about')}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div className="splashScreen">
                            <img src={splashScreen} alt="MARKETNET" />
                        </div>
                        <h4>MARKETNET</h4>
                        <p>{i18next.t('about-1')}</p>
                        <br />
                        <p>{i18next.t('about-2')}</p>
                        <br />
                        <p>{i18next.t('official-website')}: <a href="https://www.marketnet.io/">marketnet.io</a></p>
                        <p>{i18next.t('repositories')}:</p>
                        <a href="https://github.com/Itzanh/MARKETNET-Server">MARKETNET Server</a>
                        <br />
                        <a href="https://github.com/Itzanh/MARKETNET-Web">MARKETNET Web</a>
                        <br />
                        <p>{i18next.t('this-software-is-distributed-under-AGPL-license')} <a href="https://spdx.org/licenses/AGPL-3.0-or-later.html">AGPL</a></p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">{i18next.t('close')}</button>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default About;
