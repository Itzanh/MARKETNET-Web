import React, { Component, useEffect } from 'react';
import i18next from 'i18next';
import ReactDOM from 'react-dom';

// NAVBAR
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MaterialUIMenu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { StylesProvider } from '@material-ui/core/styles';

// DRAWER
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// CSS
import './../CSS/menu.css';

// IMG
import splashScreen from './../IMG/splash_screen.svg';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import DataArrayIcon from '@mui/icons-material/DataArray';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import FactoryIcon from '@mui/icons-material/Factory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SettingsIcon from '@mui/icons-material/Settings';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptIcon from '@mui/icons-material/Receipt';
import NoteIcon from '@mui/icons-material/Note';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import QrCodeIcon from '@mui/icons-material/QrCode';
import PublicIcon from '@mui/icons-material/Public';
import FlagIcon from '@mui/icons-material/Flag';
import InvertColorsIcon from '@mui/icons-material/InvertColors';
import CategoryIcon from '@mui/icons-material/Category';
import HomeIcon from '@mui/icons-material/Home';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import PaymentIcon from '@mui/icons-material/Payment';
import LanguageIcon from '@mui/icons-material/Language';
import HardwareIcon from '@mui/icons-material/Hardware';
import InventoryIcon from '@mui/icons-material/Inventory';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GroupsIcon from '@mui/icons-material/Groups';
import CableIcon from '@mui/icons-material/Cable';
import ApiIcon from '@mui/icons-material/Api';
import SummarizeIcon from '@mui/icons-material/Summarize';
import GTranslateIcon from '@mui/icons-material/GTranslate';
import WebhookIcon from '@mui/icons-material/Webhook';
import KeyIcon from '@mui/icons-material/Key';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import InfoIcon from '@mui/icons-material/Info';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import StoreIcon from '@mui/icons-material/Store';
import SyncIcon from '@mui/icons-material/Sync';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';

// COLOR
import { blue } from '@mui/material/colors';



function MainMenu({ menus, logout, handleChangePassword }) {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [menu, setMenu] = React.useState(menus[0].menu);
    const [menuName, setMenuName] = React.useState(i18next.t('management'));

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    return <AppBar position="static" sx={{ backgroundColor: blue[700] + " !important" }}>
        <Container maxWidth="xl">
            <Toolbar disableGutters>
                <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
                ><div className="logoContainer">
                        <img className="logo" src={splashScreen} alt="logo" />
                    </div>
                </Typography>

                <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleOpenNavMenu}
                        color="inherit"
                    >
                        <MenuIcon />
                    </IconButton>
                    <MaterialUIMenu
                        id="menu-appbar"
                        anchorEl={anchorElNav}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        open={Boolean(anchorElNav)}
                        onClose={handleCloseNavMenu}
                        sx={{
                            display: { xs: 'block', md: 'none' },
                        }}
                    >
                        {menu.map((page) => (
                            <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                                <Typography textAlign="center">{page.name}</Typography>
                            </MenuItem>
                        ))}
                    </MaterialUIMenu>
                </Box>

                <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
                >
                    <div className="logoContainer">
                        <img className="logo" src={splashScreen} alt="logo" />
                    </div>
                </Typography>
                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                    {menu.filter((page) => {
                        return page.visible == undefined || page.visible == true;
                    }).map((page) => (
                        <Button
                            key={page.name}
                            onClick={() => {
                                ReactDOM.unmountComponentAtNode(document.getElementById("renderMenuDrawer"));
                                ReactDOM.render(<TemporaryDrawer
                                    items={page.subItems}
                                />, document.getElementById("renderMenuDrawer"));
                            }}
                            sx={{ color: 'white !important', paddingTop: '6px !important', paddingRight: '8px !important', paddingBottom: '6px !important', paddingLeft: '8px !important' }}
                            startIcon={page.icon}
                        >
                            {page.name}
                        </Button>
                    ))}
                </Box>

                <Box sx={{ flexGrow: 0 }}>
                    <Button
                        key={menuName}
                        onClick={() => {
                            ReactDOM.unmountComponentAtNode(document.getElementById("renderMenuDrawer"));
                            ReactDOM.render(<TemporaryDrawer
                                items={[
                                    menus.filter((item) => {
                                        return item.visible == undefined || item.visible == true;
                                    }).map((item) => {
                                        return {
                                            name: item.name,
                                            icon: item.icon,
                                            onClick: () => {
                                                setMenuName(item.name);
                                                setMenu(item.menu);
                                            }
                                        }
                                    })
                                ]}
                            />, document.getElementById("renderMenuDrawer"));
                        }}
                        sx={{ color: 'white !important' }}
                        startIcon={<MenuIcon />}
                    >
                        {menuName}
                    </Button>
                    <div class="btn-group my-2 my-sm-0 ml-2" role="group" aria-label="Button group with nested dropdown">
                        <div class="btn-group" role="group">
                            <button id="btnGroupDrop1" type="button" class="btn btn-danger dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            </button>
                            <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">
                                <a class="dropdown-item" href="#" onClick={handleChangePassword}>{i18next.t('change-password')}</a>
                            </div>
                        </div>
                        <button class="btn btn-outline-danger" type="submit" style={{ color: 'white' }} onClick={logout}>{i18next.t('logout')}</button>
                    </div>
                </Box>
            </Toolbar>
        </Container>
        <div id="renderMenuDrawer"></div>
    </AppBar>
};

function TemporaryDrawer({ items }) {
    const [state, setState] = React.useState(false);
    const [mounted, setMounted] = React.useState(false);

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState(open);
    };

    const list = () => (
        <Box
            sx={'auto'}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            {items.map((list, i) => {
                return <div key={i}>
                    <List>
                        {list.map((item, i) => {
                            return <ListItem key={i} button key={item.name} onClick={() => {
                                setTimeout(() => {
                                    item.onClick();
                                }, 180);
                            }} sx={{
                                'padding-top': '8px !important',
                                'padding-bottom': '8px !important',
                                'padding-left': '16px !important',
                                'padding-right': '16px !important'
                            }}>
                                <ListItemIcon>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.name} />
                            </ListItem>
                        })}
                    </List>
                    <Divider />
                </div>
            })}
        </Box>
    );

    useEffect(() => {
        if (mounted == false) {
            setState(true);
            setMounted(true);
        }
    });

    return (
        <div>
            <React.Fragment key={"top"}>
                <Drawer
                    transitionDuration={200}
                    anchor={"top"}
                    open={state}
                    onClose={toggleDrawer(false)}
                >
                    {list()}
                </Drawer>
            </React.Fragment>
        </div>
    );
};



class Menu extends Component {
    constructor({ handleSalesOrders, handleSalesInvoices, handleSalesDeliveryNotes, handlePurchaseOrders, handlePurchaseInvoices, handlePurchaseDeliveryNotes, handleNeeds, handleCustomers, handleSuppliers, handleProducts, handleCountries, handleStates, handleColors, handleProductFamilies, handleAddresses, handleCarriers, handleBillingSeries, handleCurrencies, handlePaymentMethod, handleLanguage, handlePackages, handleIncoterms, handleDocuments, handleDocumentContainers, handleWarehouse, handleWarehouseMovements, handleManufacturingOrders, handleManufacturingOrderTypes, handlePackaging, handleShipping, handleCollectShipping, handleSettings, handleUsers, handleAbout, handleGroups, handleConnections, handleImportFromPrestaShop, handlePSZones, prestaShopVisible, permissions, logout, handleJournals, handleAccounts, handleAccountingMovements, handlePostSalesInvoices, handlePostPurchaseInvoices, handleCharges, handlePayments, handleMonthlySalesAmount, handleMonthlySalesQuantity, handleSalesOfAProductQuantity, handleSalesOfAProductAmount, handleDaysOfServiceSaleOrders, handleDaysOfServicePurchaseOrders, handleMonthlyPurchaseAmount, handlePaymentMethodsSaleOrdersQuantity, handleCountriesSaleOrdersAmount, handleManufacturingQuantity, handleDailyShippingQuantity, handleShippingsByCarrier, handleApiKeys, wooCommerceVisible, handleImportFromWooCommerce, handleConnectionLog, handleConnectionFilters, shopifyVisible, handleImportFromShopify, tabReportTemplates, tabEmailLogs, handleChangePassword, handleComplexManufacturingOrders, handlePosTerminals, handlePOSTerminalSaleOrders, handlePermissionDictionary, handleTrialBalance, handleReportTemplateTranslation, handleStatisticsBenefits, handleReport111, handleReport115, handleInventory, handleInventoyValuation, handleWebHookSettings, tabTransferBetweenWarehouses, tabIntrastat, tabGenerateManufacturingOrders, menu }) {
        super();

        this.handleSalesOrders = handleSalesOrders;
        this.handleSalesInvoices = handleSalesInvoices;
        this.handleSalesDeliveryNotes = handleSalesDeliveryNotes;
        this.handlePurchaseOrders = handlePurchaseOrders;
        this.handlePurchaseInvoices = handlePurchaseInvoices;
        this.handlePurchaseDeliveryNotes = handlePurchaseDeliveryNotes;
        this.handleNeeds = handleNeeds;
        this.handleCustomers = handleCustomers;
        this.handleSuppliers = handleSuppliers;
        this.handleProducts = handleProducts;
        this.handleCountries = handleCountries;
        this.handleStates = handleStates;
        this.handleColors = handleColors;
        this.handleProductFamilies = handleProductFamilies;
        this.handleAddresses = handleAddresses;
        this.handleCarriers = handleCarriers;
        this.handleBillingSeries = handleBillingSeries;
        this.handleCurrencies = handleCurrencies;
        this.handlePaymentMethod = handlePaymentMethod;
        this.handleLanguage = handleLanguage;
        this.handlePackages = handlePackages;
        this.handleIncoterms = handleIncoterms;
        this.handleDocuments = handleDocuments;
        this.handleDocumentContainers = handleDocumentContainers;
        this.handleWarehouse = handleWarehouse;
        this.handleWarehouseMovements = handleWarehouseMovements;
        this.handleManufacturingOrders = handleManufacturingOrders;
        this.handleManufacturingOrderTypes = handleManufacturingOrderTypes;
        this.handlePackaging = handlePackaging;
        this.handleShipping = handleShipping;
        this.handleCollectShipping = handleCollectShipping;
        this.handleSettings = handleSettings;
        this.handleUsers = handleUsers;
        this.handleGroups = handleGroups;
        this.handleConnections = handleConnections;
        this.handleAbout = handleAbout;
        this.handleImportFromPrestaShop = handleImportFromPrestaShop;
        this.handlePSZones = handlePSZones;
        this.prestaShopVisible = prestaShopVisible;
        this.permissions = permissions;
        this.logout = logout;
        this.handleJournals = handleJournals;
        this.handleAccounts = handleAccounts;
        this.handleAccountingMovements = handleAccountingMovements;
        this.handlePostSalesInvoices = handlePostSalesInvoices;
        this.handlePostPurchaseInvoices = handlePostPurchaseInvoices;
        this.handleCharges = handleCharges;
        this.handlePayments = handlePayments;
        this.handleMonthlySalesAmount = handleMonthlySalesAmount;
        this.handleMonthlySalesQuantity = handleMonthlySalesQuantity;
        this.handleSalesOfAProductQuantity = handleSalesOfAProductQuantity;
        this.handleSalesOfAProductAmount = handleSalesOfAProductAmount;
        this.handleDaysOfServiceSaleOrders = handleDaysOfServiceSaleOrders;
        this.handleDaysOfServicePurchaseOrders = handleDaysOfServicePurchaseOrders;
        this.handleMonthlyPurchaseAmount = handleMonthlyPurchaseAmount;
        this.handlePaymentMethodsSaleOrdersQuantity = handlePaymentMethodsSaleOrdersQuantity;
        this.handleCountriesSaleOrdersAmount = handleCountriesSaleOrdersAmount;
        this.handleManufacturingQuantity = handleManufacturingQuantity;
        this.handleDailyShippingQuantity = handleDailyShippingQuantity;
        this.handleShippingsByCarrier = handleShippingsByCarrier;
        this.handleApiKeys = handleApiKeys;
        this.wooCommerceVisible = wooCommerceVisible;
        this.handleImportFromWooCommerce = handleImportFromWooCommerce;
        this.handleConnectionLog = handleConnectionLog;
        this.handleConnectionFilters = handleConnectionFilters;
        this.shopifyVisible = shopifyVisible;
        this.handleImportFromShopify = handleImportFromShopify;
        this.handleReportTemplates = tabReportTemplates;
        this.handleEmailLogs = tabEmailLogs;
        this.handleChangePassword = handleChangePassword;
        this.handleComplexManufacturingOrders = handleComplexManufacturingOrders;
        this.handlePosTerminals = handlePosTerminals;
        this.handlePOSTerminalSaleOrders = handlePOSTerminalSaleOrders;
        this.handlePermissionDictionary = handlePermissionDictionary;
        this.handleTrialBalance = handleTrialBalance;
        this.handleReportTemplateTranslation = handleReportTemplateTranslation;
        this.handleStatisticsBenefits = handleStatisticsBenefits;
        this.handleReport111 = handleReport111;
        this.handleReport115 = handleReport115;
        this.handleInventory = handleInventory;
        this.handleInventoyValuation = handleInventoyValuation;
        this.handleWebHookSettings = handleWebHookSettings;
        this.tabTransferBetweenWarehouses = tabTransferBetweenWarehouses;
        this.tabIntrastat = tabIntrastat;
        this.tabGenerateManufacturingOrders = tabGenerateManufacturingOrders;

        this.menu = menu != undefined ? menu : "M"; // M = Management, A = Accounting
    }

    render() {
        const menuManagement = [
            {
                name: i18next.t('sales'),
                icon: <MonetizationOnIcon />,
                visible: this.permissions.sales,
                subItems: [
                    [
                        {
                            name: i18next.t('orders'),
                            icon: <ShoppingCartIcon />,
                            onClick: this.handleSalesOrders
                        },
                        {
                            name: i18next.t('invoices'),
                            icon: <ReceiptIcon />,
                            onClick: this.handleSalesInvoices
                        },
                        {
                            name: i18next.t('delivery-notes'),
                            icon: <NoteIcon />,
                            onClick: this.handleSalesDeliveryNotes
                        }
                    ], [
                        {
                            name: i18next.t('generate-manufacturing-orders'),
                            icon: <PrecisionManufacturingIcon />,
                            onClick: this.tabGenerateManufacturingOrders
                        }
                    ]
                ]
            },
            {
                name: i18next.t('purchases'),
                icon: <ShoppingBasketIcon />,
                visible: this.permissions.purchases,
                subItems: [
                    [
                        {
                            name: i18next.t('orders'),
                            icon: <ShoppingCartIcon />,
                            onClick: this.handlePurchaseOrders
                        },
                        {
                            name: i18next.t('invoices'),
                            icon: <ReceiptIcon />,
                            onClick: this.handlePurchaseInvoices
                        },
                        {
                            name: i18next.t('delivery-notes'),
                            icon: <NoteIcon />,
                            onClick: this.handlePurchaseDeliveryNotes
                        }
                    ],
                    [
                        {
                            name: i18next.t('needs'),
                            icon: <AddShoppingCartIcon />,
                            onClick: this.handleNeeds
                        }
                    ]
                ]
            },
            {
                name: i18next.t('masters'),
                icon: <DataArrayIcon />,
                visible: this.permissions.masters,
                subItems: [
                    [
                        {
                            name: i18next.t('customers'),
                            icon: <PersonIcon />,
                            onClick: this.handleCustomers
                        }, {
                            name: i18next.t('suppliers'),
                            icon: <PersonIcon />,
                            onClick: this.handleSuppliers
                        }, {
                            name: i18next.t('products'),
                            icon: <QrCodeIcon />,
                            onClick: this.handleProducts
                        }, {
                            name: i18next.t('countries'),
                            icon: <PublicIcon />,
                            onClick: this.handleCountries
                        }, {
                            name: i18next.t('states'),
                            icon: <FlagIcon />,
                            onClick: this.handleStates
                        }, {
                            name: i18next.t('colors'),
                            icon: <InvertColorsIcon />,
                            onClick: this.handleColors
                        },
                    ],
                    [
                        {
                            name: i18next.t('product-families'),
                            icon: <CategoryIcon />,
                            onClick: this.handleProductFamilies
                        }, , {
                            name: i18next.t('addresses'),
                            icon: <HomeIcon />,
                            onClick: this.handleAddresses
                        }, {
                            name: i18next.t('carriers'),
                            icon: <LocalShippingIcon />,
                            onClick: this.handleCarriers
                        }, {
                            name: i18next.t('billing-series'),
                            icon: <ReceiptIcon />,
                            onClick: this.handleBillingSeries
                        }, {
                            name: i18next.t('currencies'),
                            icon: <LocalAtmIcon />,
                            onClick: this.handleCurrencies
                        }, {
                            name: i18next.t('payment-methods'),
                            icon: <PaymentIcon />,
                            onClick: this.handlePaymentMethod
                        }, {
                            name: i18next.t('languages'),
                            icon: <LanguageIcon />,
                            onClick: this.handleLanguage
                        }, {
                            name: i18next.t('packages'),
                            icon: <LocalShippingIcon />,
                            onClick: this.handlePackages
                        }, {
                            name: i18next.t('incoterms'),
                            icon: <PublicIcon />,
                            onClick: this.handleIncoterms
                        }, {
                            name: i18next.t('documents'),
                            icon: <NoteIcon />,
                            onClick: this.handleDocuments
                        }, {
                            name: i18next.t('document-containers'),
                            icon: <NoteIcon />,
                            onClick: this.handleDocumentContainers
                        },
                    ]
                ]
            },
            {
                name: i18next.t('warehouse'),
                icon: <WarehouseIcon />,
                visible: this.permissions.warehouse,
                subItems: [
                    [
                        {
                            name: i18next.t('warehouses'),
                            icon: <WarehouseIcon />,
                            onClick: this.handleWarehouse
                        }, {
                            name: i18next.t('warehouse-movements'),
                            icon: <HardwareIcon />,
                            onClick: this.handleWarehouseMovements
                        },
                    ],
                    [
                        {
                            name: i18next.t('transfer-between-warehouses'),
                            icon: <LocalShippingIcon />,
                            onClick: this.tabTransferBetweenWarehouses
                        },
                        {
                            name: i18next.t('inventory'),
                            icon: <InventoryIcon />,
                            onClick: this.handleInventory
                        },
                    ]
                ]
            },
            {
                name: i18next.t('manufacturing'),
                icon: <FactoryIcon />,
                visible: this.permissions.manufacturing,
                subItems: [
                    [
                        {
                            name: i18next.t('manufacturing-orders'),
                            icon: <FactoryIcon />,
                            onClick: this.handleManufacturingOrders
                        }, {
                            name: i18next.t('complex-manufacturing-orders'),
                            icon: <PrecisionManufacturingIcon />,
                            onClick: this.handleComplexManufacturingOrders
                        },
                    ],
                    [
                        {
                            name: i18next.t('manufacturing-order-types'),
                            icon: <SettingsApplicationsIcon />,
                            onClick: this.handleManufacturingOrderTypes
                        },
                    ]
                ]
            },
            {
                name: i18next.t('preparation'),
                icon: <LocalShippingIcon />,
                visible: this.permissions.preparation,
                subItems: [
                    [
                        {
                            name: i18next.t('packaging'),
                            icon: <ListAltIcon />,
                            onClick: this.handlePackaging
                        },
                        {
                            name: i18next.t('shippings'),
                            icon: <LocalShippingIcon />,
                            onClick: this.handleShipping
                        }
                    ], [
                        {
                            name: i18next.t('collect-shippings'),
                            icon: <LocalShippingIcon />,
                            onClick: this.handleCollectShipping
                        }
                    ]
                ]
            },
            {
                name: i18next.t('utils'),
                icon: <SettingsIcon />,
                visible: this.permissions.admin,
                subItems: [
                    [
                        {
                            name: i18next.t('settings'),
                            icon: <SettingsApplicationsIcon />,
                            onClick: this.handleSettings
                        }, {
                            name: i18next.t('users'),
                            icon: <AccountCircleIcon />,
                            onClick: this.handleUsers
                        }, {
                            name: i18next.t('groups'),
                            icon: <GroupsIcon />,
                            onClick: this.handleGroups
                        }, {
                            name: i18next.t('connections'),
                            icon: <CableIcon />,
                            onClick: this.handleConnections
                        }, {
                            name: i18next.t('api-keys'),
                            icon: <ApiIcon />,
                            onClick: this.handleApiKeys
                        }, {
                            name: i18next.t('report-templates'),
                            icon: <SummarizeIcon />,
                            onClick: this.handleReportTemplates
                        }, , {
                            name: i18next.t('report-template-translation'),
                            icon: <GTranslateIcon />,
                            onClick: this.handleReportTemplateTranslation
                        }, , {
                            name: i18next.t('pos-terminals'),
                            icon: <PointOfSaleIcon />,
                            onClick: this.handlePosTerminals
                        }, , {
                            name: i18next.t('webhook-settings'),
                            icon: <WebhookIcon />,
                            onClick: this.handleWebHookSettings
                        },
                    ], [
                        {
                            name: i18next.t('connection-log'),
                            icon: <KeyIcon />,
                            onClick: this.handleConnectionLog
                        }, {
                            name: i18next.t('connection-filters'),
                            icon: <FilterAltIcon />,
                            onClick: this.handleConnectionFilters
                        }, {
                            name: i18next.t('email-logs'),
                            icon: <MarkEmailReadIcon />,
                            onClick: this.handleEmailLogs
                        }, {
                            name: i18next.t('permission-dictionary'),
                            icon: <FormatListBulletedIcon />,
                            onClick: this.handlePermissionDictionary
                        },
                    ], [
                        {
                            name: i18next.t('about'),
                            icon: <InfoIcon />,
                            onClick: this.handleAbout
                        }
                    ]
                ]
            }];
        const menuAccounting = [
            {
                name: i18next.t('sales'),
                subItems: [
                    [
                        {
                            name: i18next.t('post-invoices'),
                            onClick: this.handlePostSalesInvoices
                        }, {
                            name: i18next.t('charges'),
                            onClick: this.handleCharges
                        }
                    ]
                ]
            }, {
                name: i18next.t('purchases'),
                subItems: [
                    [
                        {
                            name: i18next.t('post-invoices'),
                            onClick: this.handlePostPurchaseInvoices
                        }, {
                            name: i18next.t('payments'),
                            onClick: this.handlePayments
                        }
                    ]
                ]
            }, {
                name: i18next.t('accounting-movements'),
                subItems: [
                    [
                        {
                            name: i18next.t('accounting-movements'),
                            onClick: this.handleAccountingMovements
                        }, {
                            name: i18next.t('trial-balance'),
                            onClick: this.handleTrialBalance
                        }
                    ]
                ]
            }, {
                name: i18next.t('masters'),
                subItems: [
                    [
                        {
                            name: i18next.t('journals'),
                            onClick: this.handleJournals
                        }, {
                            name: i18next.t('accounts'),
                            onClick: this.handleAccounts
                        }
                    ]
                ]
            }, {
                name: i18next.t('reports'),
                subItems: [
                    [
                        {
                            name: i18next.t('report-111'),
                            onClick: this.handleReport111
                        }, {
                            name: i18next.t('report-115'),
                            onClick: this.handleReport115
                        }, {
                            name: 'Intrastat',
                            onClick: this.tabIntrastat
                        }
                    ]
                ]
            }, {
                name: i18next.t('warehouse'),
                subItems: [
                    [
                        {
                            name: i18next.t('inventory-valuation'),
                            onClick: this.handleInventoyValuation
                        }
                    ]
                ]
            }
        ];
        const menuAnalytics = [
            {
                name: i18next.t('sales'),
                subItems: [
                    [
                        {
                            name: i18next.t('monthly-sales-amount'),
                            onClick: this.handleMonthlySalesAmount
                        }, {
                            name: i18next.t('monthly-sales-quantity'),
                            onClick: this.handleMonthlySalesQuantity
                        }, {
                            name: i18next.t('sales-of-a-product-quantity'),
                            onClick: this.handleSalesOfAProductQuantity
                        }, {
                            name: i18next.t('sales-of-a-product-amount'),
                            onClick: this.handleSalesOfAProductAmount
                        }, {
                            name: i18next.t('days-of-service-sale-orders'),
                            onClick: this.handleDaysOfServiceSaleOrders
                        }, {
                            name: i18next.t('payment-methods-of-the-sale-orders'),
                            onClick: this.handlePaymentMethodsSaleOrdersQuantity
                        }, {
                            name: i18next.t('sale-orders-by-country'),
                            onClick: this.handleCountriesSaleOrdersAmount
                        }, {
                            name: i18next.t('benefits'),
                            onClick: this.handleStatisticsBenefits
                        }
                    ]
                ]
            }, {
                name: i18next.t('purchases'),
                subItems: [
                    [
                        {
                            name: i18next.t('days-of-service-purchase-orders'),
                            onClick: this.handleDaysOfServicePurchaseOrders
                        }, {
                            name: i18next.t('monthly-purchases-amount'),
                            onClick: this.handleMonthlyPurchaseAmount
                        }
                    ]
                ]
            }, {
                name: i18next.t('manufacturing'),
                subItems: [
                    [
                        {
                            name: i18next.t('manufacturing-orders-created-manufactured'),
                            onClick: this.handleManufacturingQuantity
                        }
                    ]
                ]
            }, {
                name: i18next.t('preparation'),
                subItems: [
                    [
                        {
                            name: i18next.t('daily-shippings'),
                            onClick: this.handleDailyShippingQuantity
                        }, {
                            name: i18next.t('shippings-by-carrier'),
                            onClick: this.handleShippingsByCarrier
                        }
                    ]
                ]
            }
        ];
        const menus = [
            {
                name: i18next.t('management'),
                icon: <FactoryIcon />,
                menu: menuManagement
            }, {
                name: i18next.t('accounting'),
                icon: <AccountBalanceIcon />,
                visible: this.permissions.accounting,
                menu: menuAccounting
            }, {
                name: i18next.t('analytics'),
                icon: <EqualizerIcon />,
                menu: menuAnalytics
            }
        ];

        if (this.prestaShopVisible && this.permissions.prestashop) {
            menuManagement.push({
                name: i18next.t('prestaShop'),
                icon: <StoreIcon />,
                subItems: [
                    [
                        {
                            name: i18next.t('import'),
                            icon: <SyncIcon />,
                            onClick: this.handleImportFromPrestaShop
                        }
                    ],
                    [
                        {
                            name: i18next.t('prestaShop-zones'),
                            onClick: this.handlePSZones
                        }
                    ]
                ]
            });
        } else if (this.wooCommerceVisible && this.permissions.admin) {
            menuManagement.push({
                name: 'WooCommerce',
                icon: <StoreIcon />,
                subItems: [
                    [
                        {
                            name: i18next.t('import'),
                            icon: <SyncIcon />,
                            onClick: this.handleImportFromShopify
                        }
                    ]
                ]
            });
        } else if (this.shopifyVisible && this.permissions.admin) {
            menuManagement.push({
                name: 'Shopify',
                icon: <StoreIcon />,
                subItems: [
                    [
                        {
                            name: i18next.t('import'),
                            icon: <SyncIcon />,
                            onClick: this.handleImportFromShopify
                        }
                    ]
                ]
            });
        }

        if (this.permissions.pointOfSale) {
            menuManagement.push({
                name: i18next.t('point-of-sale'),
                icon: <PointOfSaleIcon />,
                subItems: [
                    [
                        {
                            name: i18next.t('point-of-sale'),
                            icon: <PointOfSaleIcon />,
                            onClick: this.handlePOSTerminalSaleOrders
                        }
                    ]
                ]
            });
        }

        return <div>
            <StylesProvider injectFirst>
                <MainMenu
                    menus={menus}
                    logout={this.logout}
                    handleChangePassword={this.handleChangePassword}
                />
            </StylesProvider>
            <div id="renderTab" className="p-1"></div>
        </div>
    }
}

export default Menu;
