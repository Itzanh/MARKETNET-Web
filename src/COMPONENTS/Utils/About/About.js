import { Component } from "react";

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
                        <h5 class="modal-title" id="aboutModalLabel">About</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div className="splashScreen">
                            <img src={splashScreen} alt="MARKETNET" />
                        </div>
                        <h4>MARKETNET</h4>
                        <p>Marketnet is an un-deprecated ERP software, that will make your enterprise management easier.</p>
                        <br />
                        <p>Both server and client on this software are open source and free software, feel free to download the source code and add all those interesting features that your business needs and aren't inclued in this base software. Pull requests are also welcome.</p>
                        <br />
                        <p>Official website: <a href="https://www.marketnet.io/">marketnet.io</a></p>
                        <p>Repositories:</p>
                        <a href="https://github.com/Itzanh/MARKETNET-Server">MARKETNET Server</a>
                        <br />
                        <a href="https://github.com/Itzanh/MARKETNET-Web">MARKETNET Web</a>
                        <br />
                        <p>This software is distributed under <a href="https://spdx.org/licenses/AGPL-3.0-or-later.html">AGPL</a> license.</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default About;
