import logo200Image from 'assets/img/logo/logo_200.png';
import sidebarBgImage from 'assets/img/sidebar/sidebar-0.jpg';
import SourceLink from 'components/SourceLink';
import React from 'react';
//import { FaGithub } from 'react-icons/fa';
import {
  MdLocalPharmacy,
  MdLocalShipping,
  MdLocationOn,
  MdCardGiftcard,
  MdDescription,
  MdSchedule,
  MdEqualizer,
  MdLayers,
  MdBubbleChart,
  MdStyle,
  MdStore,
  MdAssignment,
  MdAccountCircle,
  MdArrowDropDownCircle,
  MdBorderAll,
  MdBrush,
  MdChromeReaderMode,
  MdDashboard,
  MdExtension,
  MdGroupWork,
  MdInsertChart,
  MdKeyboardArrowDown,
  MdNotificationsActive,
  MdPages,
  MdRadioButtonChecked,
  MdSend,
  MdStar,
  MdTextFields,
  MdViewCarousel,
  MdViewDay,
  MdViewList,
  MdWeb,
  MdWidgets,
  MdPhone,
  MdArchive,
  MdBook,
  MdFolderOpen,
  MdAttachMoney,
  MdPalette,
  MdPhotoCamera,
  MdImportExport,
  MdPayment
} from 'react-icons/md';
import { NavLink } from 'react-router-dom';
import {
  // UncontrolledTooltip,
  Collapse,
  Nav,
  Navbar,
  NavItem,
  NavLink as BSNavLink,
} from 'reactstrap';
import bn from 'utils/bemnames';

const sidebarBackground = {
  backgroundImage: `url("${sidebarBgImage}")`,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
};

const navTeamADF= [
  { to: '/group-pemilik-lokasi', name: 'Group Pemilik Lokasi', exact: false, Icon: MdAccountCircle }, //MdAccountCircle
  { to: '/jenis-area', name: 'jenis area', exact: false, Icon: MdLocationOn }, //MdLocationOn
  { to: '/shift-outlet', name: 'shift outlet', exact: false, Icon: MdSchedule },//MdSchedule
];

const navMasterOutlet=[
  { to: '/outlet', name: 'outlet', exact: false, Icon: MdStore }, //MdStore
  { to: '/outletstocktake', name: 'stocktake', exact: false, Icon: MdImportExport}, //MdImportExport
  { to: '/outletdatacamera', name: 'data camera', exact: false, Icon: MdPhotoCamera}, //MdPhotoCamera
  { to: '/outletdataapotik', name: 'data apotik', exact: false, Icon: MdFolderOpen }, //MdFolderOpen
  { to: '/outletbusdev', name: 'busdev', exact: false, Icon: MdPayment}, //MdPayment
  { to: '/outletaccounting', name: 'accounting', exact: false, Icon: MdAttachMoney }, //MdAttachMoney
  { to: '/outletfinance', name: 'finance', exact: false, Icon: MdAttachMoney }, //MdAttachMoney
]

const navSpdo = [
  { to: '/spdo', name: 'spdo', exact: false, Icon: MdStore },
  { to: '/crp2-tidak-refill', name: 'crp tidak refill', exact: false, Icon: MdStore },
  { to: '/correction', name: 'correction', exact: false, Icon: MdStore },
  { to: '/batch-monitoring', name: 'batch monitoring', exact: false, Icon: MdStore }
]

const navMasterDataA = [
  { to: '/dosageform', name: 'dosage form', exact: false, Icon:  "none"}, //MdLocalPharmacy
  { to: '/generik', name: 'generik', exact: false, Icon: "none" }, //MdLocalShipping
  { to: '/klasifikasi-bpom', name: 'klasifikasi bpom', exact: false, Icon: "none" }, //MdDescription
  { to: '/strength', name: 'strength', exact: false, Icon: "none" }, //MdEqualizer
];

const navMasterDataC = [
  { to: '/confirm-schedule-hja', name: 'confirm schedule hja', exact: false, Icon: "none" }, //MdSchedule
  { to: '/point', name: 'point', exact: false, Icon: "none" }, //MdLocationOn
  { to: '/produk', name: 'produk', exact: false, Icon: "none" }, //MdSchedule
];

const navMasterDataD = [
  { to: '/brand', name: 'brand', exact: false, Icon: "none" }, //MdLocalShipping
  { to: '/gimmick', name: 'gimmick', exact: false, Icon: "none" }, //MdLocationOn
  { to: '/principal', name: 'principal', exact: false, Icon: "none" },//MdSchedule
  { to: '/supplier', name: 'supplier', exact: false, Icon: "none" } //MdLayers
];

const navMasterDataE = [
  { to: '/bridging-supplier-kota', name: 'bridging supplier kota', exact: false, Icon: "none" }, //MdLocalShipping
  { to: '/copy-temp-beli-lokal', name: 'copy template pembelian lokal', exact: false, Icon: "none" }, //MdLocationOn
  { to: '/pembelian-lokal', name: 'pembelian lokal', exact: false, Icon: "none" }, //MdSchedule
];

const navMasterDataF = [
  { to: '/produk-counter', name: 'produk counter', exact: false, Icon: "none" },//MdLocalShipping
  { to: '/departemen-produk', name: 'departemen produk', exact: false, Icon: "none" }, //MdLocalShipping
  { to: '/dimensi', name: 'dimensi', exact: false, Icon: "none" }, //MdLocationOn
  { to: '/karakteristik-produk', name: 'karakteristik produk', exact: false, Icon: "none" }, //MdSchedule
  { to: '/kemasan', name: 'kemasan', exact: false, Icon: "none" }, //MdCardGiftcard
  { to: '/pure-dead', name: 'produk pure-dead', exact: false, Icon: "none" }, //MdCardGiftcard
  { to: '/unit', name: 'unit', exact: false, Icon: "none" } //MdLayers
];

const navMasterDataG = [
  { to: '/alasan', name: 'alasan', exact: false, Icon: "none" }, //MdLocalShipping
  { to: '/biaya-ekspedisi', name: 'biaya ekspedisi', exact: false, Icon: "none" }, //MdLocalShipping
  { to: '/minimal-sp', name: 'minimal sp', exact: false, Icon: "none" }, //MdLocationOn
  { to: '/mobil', name: 'mobil', exact: false, Icon: "none" }, //MdSchedule
  { to: '/titipan-luar-kota', name: 'titipan luar kota', exact: false, Icon: "none" },//MdSchedule
];

const navMasterDataH = [
  { to: '/jenis-outlet', name: 'jenis outlet', exact: false, Icon: "none" }, //MdLocationOn
  { to: '/ekspedisi', name: 'ekspedisi', exact: false, Icon: MdLocalShipping },//MdLocalShipping
];

const navMasterDataI = [
  { to: '/diagnosa', name: 'diagnosa', exact: false, Icon: "none" }, //MdLocationOn
  { to: '/kategori-print', name: 'kategori print', exact: false, Icon: "none" }, //MdLocationOn
  { to: '/solusi', name: 'solusi', exact: false, Icon: "none" }, //MdLocationOn
  { to: '/tc-print', name: 'tc print', exact: false, Icon: "none" }, //MdSchedule
];

const navComponents = [
  { to: '/buttons', name: 'buttons', exact: false, Icon: MdRadioButtonChecked },
  { to: '/button-groups', name: 'button groups', exact: false, Icon: MdGroupWork },
  { to: '/forms', name: 'forms', exact: false, Icon: MdChromeReaderMode },
  { to: '/input-groups', name: 'input groups', exact: false, Icon: MdViewList },
  { to: '/dropdowns', name: 'dropdowns', exact: false, Icon: MdArrowDropDownCircle },
  { to: '/badges', name: 'badges', exact: false, Icon: MdStar },
  { to: '/alerts', name: 'alerts', exact: false, Icon: MdNotificationsActive },
  { to: '/progress', name: 'progress', exact: false, Icon: MdBrush },
  { to: '/modals', name: 'modals', exact: false, Icon: MdViewDay },
];

const navContents = [
  { to: '/typography', name: 'typography', exact: false, Icon: MdTextFields },
  { to: '/tables', name: 'tables', exact: false, Icon: MdBorderAll },
];

const pageContents = [
  { to: '/', name: 'login / signup', exact: false, Icon: MdAccountCircle },
  { to: '/login-modal', name: 'login modal', exact: false, Icon: MdViewCarousel },
];

const navItems = [
  { to: '/dashboard', name: 'dashboard', exact: true, Icon: MdDashboard },
];

const navItems2 = [
  { to: '/cards', name: 'cards', exact: false, Icon: MdWeb },
  { to: '/charts', name: 'charts', exact: false, Icon: MdInsertChart },
  { to: '/widgets', name: 'widgets', exact: false, Icon: MdWidgets },
];

const bem = bn.create('sidebar');

class Sidebar extends React.Component {
  state = {
    isOpenTeamADF: true,
    isOpenMasterOutlet : true,
    isOpenSpdo: true,
    isOpenMasterA: false,
    isOpenMasterC: false,
    isOpenMasterD: false,
    isOpenMasterE: false,
    isOpenMasterF: false,
    isOpenMasterG: false,
    isOpenMasterH: false,
    isOpenMasterI: false,
    isOpenComponents: true,
    isOpenContents: true,
    isOpenPages: true,
  };

  handleClick = name => () => {
    this.setState(prevState => {
      const isOpen = prevState[`isOpen${name}`];

      return {
        [`isOpen${name}`]: !isOpen,
      };
    });
  };

  render() {
    return (
      <aside className={bem.b()} data-image={sidebarBgImage}>
        <div className={bem.e('background')} style={sidebarBackground} />
        <div className={bem.e('content')}>
          <Navbar>
            <SourceLink className="navbar-brand d-flex">
              <img
                src={logo200Image}
                width="40"
                height="30"
                className="pr-2"
                alt=""
              />
              <span className="text-white">
                Neo Genesis
              </span>
            </SourceLink>
          </Navbar>

          <Nav vertical>
            {navItems.map(({ to, name, exact, Icon }, index) => (
              <NavItem key={index} className={bem.e('nav-item')}>
                <BSNavLink
                  id={`navItem-${name}-${index}`}
                  className="text-uppercase"
                  tag={NavLink}
                  to={to}
                  activeClassName="active"
                  exact={exact}
                >
                  <Icon className={bem.e('nav-item-icon')} />
                  <span className="">{name}</span>
                </BSNavLink>
              </NavItem>
            ))}

              {/* TEAM ADF */}
            <NavItem
              className={bem.e('nav-item')}
              onClick={this.handleClick('TeamADF')}
            >
              <BSNavLink className={bem.e('nav-item-collapse')}>
                <div className="d-flex">
                  <MdAssignment className={bem.e('nav-item-icon')} />
                  <span className="">TEAM ADF</span>
                </div>
                <MdKeyboardArrowDown
                  className={bem.e('nav-item-icon')}
                  style={{
                    padding: 0,
                    transform: this.state.isOpenTeamADF
                      ? 'rotate(0deg)'
                      : 'rotate(-90deg)',
                    transitionDuration: '0.3s',
                    transitionProperty: 'transform',
                  }}
                />
              </BSNavLink>
            </NavItem>
            <Collapse isOpen={this.state.isOpenTeamADF}>
              {navTeamADF.map(({ to, name, exact, Icon }, index) => (
                <NavItem key={index} className={bem.e('nav-item')}>
                  <BSNavLink
                    id={`navItem-${name}-${index}`}
                    className="text-uppercase"
                    tag={NavLink}
                    to={to}
                    activeClassName="active"
                    exact={exact}
                  >
                    <Icon className={bem.e('nav-item-icon')} />
                    <span className="">{name}</span>
                  </BSNavLink>
                </NavItem>
              ))}
            </Collapse>

              {/* MASTER OUTLET */}
              <NavItem
              className={bem.e('nav-item')}
              onClick={this.handleClick('MasterOutlet')}
            >
              <BSNavLink className={bem.e('nav-item-collapse')}>
                <div className="d-flex">
                  <MdAssignment className={bem.e('nav-item-icon')} />
                  <span className="">Master Outlet</span>
                </div>
                <MdKeyboardArrowDown
                  className={bem.e('nav-item-icon')}
                  style={{
                    padding: 0,
                    transform: this.state.isOpenMasterOutlet
                      ? 'rotate(0deg)'
                      : 'rotate(-90deg)',
                    transitionDuration: '0.3s',
                    transitionProperty: 'transform',
                  }}
                />
              </BSNavLink>
            </NavItem>
            <Collapse isOpen={this.state.isOpenMasterOutlet}>
              {navMasterOutlet.map(({ to, name, exact, Icon }, index) => (
                <NavItem key={index} className={bem.e('nav-item')}>
                  <BSNavLink
                    id={`navItem-${name}-${index}`}
                    className="text-uppercase"
                    tag={NavLink}
                    to={to}
                    activeClassName="active"
                    exact={exact}
                  >
                    <Icon className={bem.e('nav-item-icon')} />
                    <span className="">{name}</span>
                  </BSNavLink>
                </NavItem>
              ))}
            </Collapse>

            {/* SPDO */}
            <NavItem
              className={bem.e('nav-item')}
              onClick={this.handleClick('Spdo')}>
              <BSNavLink className={bem.e('nav-item-collapse')}>
                <div className="d-flex">
                  <MdAssignment className={bem.e('nav-item-icon')} />
                  <span className="">SPDO</span>
                </div>
                <MdKeyboardArrowDown
                  className={bem.e('nav-item-icon')}
                  style={{
                    padding: 0,
                    transform: this.state.isOpenSpdo
                      ? 'rotate(0deg)'
                      : 'rotate(-90deg)',
                    transitionDuration: '0.3s',
                    transitionProperty: 'transform',
                  }}
                />
              </BSNavLink>
            </NavItem>
            <Collapse isOpen={this.state.isOpenSpdo}>
              {navSpdo.map(({ to, name, exact, Icon }, index) =>
                <NavItem key={index} className={'ml-4 ' + bem.e('nav-item')}>
                  <BSNavLink
                    id={`navItem-${name}-${index}`}
                    className="text-uppercase"
                    tag={NavLink}
                    to={to}
                    activeClassName="active"
                    exact={exact}
                  >
                    <Icon className={bem.e('nav-item-icon')} />
                    <span className="">{name}</span>
                  </BSNavLink>
                </NavItem>
              )}
            </Collapse>

            {/* Master A   */}
            <NavItem
              className={bem.e('nav-item')}
              onClick={this.handleClick('MasterA')}
            >
              <BSNavLink className={bem.e('nav-item-collapse')}>
                <div className="d-flex">
                  <MdAssignment className={bem.e('nav-item-icon')} />
                  <span className="">Master Data A</span>
                </div>
                <MdKeyboardArrowDown
                  className={bem.e('nav-item-icon')}
                  style={{
                    padding: 0,
                    transform: this.state.isOpenMasterA
                      ? 'rotate(0deg)'
                      : 'rotate(-90deg)',
                    transitionDuration: '0.3s',
                    transitionProperty: 'transform',
                  }}
                />
              </BSNavLink>
            </NavItem>
            <Collapse isOpen={this.state.isOpenMasterA}>
              {navMasterDataA.map(({ to, name, exact, Icon }, index) => (
                <NavItem key={index} className={bem.e('nav-item')}>
                  <BSNavLink
                    id={`navItem-${name}-${index}`}
                    className="text-uppercase"
                    tag={NavLink}
                    to={to}
                    activeClassName="active"
                    exact={exact}
                  >
                    <Icon className={bem.e('nav-item-icon')} />
                    <span className="">{name}</span>
                  </BSNavLink>
                </NavItem>
              ))}
            </Collapse>

            {/* Master C   */}
            <NavItem
              className={bem.e('nav-item')}
              onClick={this.handleClick('MasterC')}
            >
              <BSNavLink className={bem.e('nav-item-collapse')}>
                <div className="d-flex">
                  <MdAssignment className={bem.e('nav-item-icon')} />
                  <span className="">Master Data C</span>
                </div>
                <MdKeyboardArrowDown
                  className={bem.e('nav-item-icon')}
                  style={{
                    padding: 0,
                    transform: this.state.isOpenMasterC
                      ? 'rotate(0deg)'
                      : 'rotate(-90deg)',
                    transitionDuration: '0.3s',
                    transitionProperty: 'transform',
                  }}
                />
              </BSNavLink>
            </NavItem>
            <Collapse isOpen={this.state.isOpenMasterC}>
              {navMasterDataC.map(({ to, name, exact, Icon }, index) => (
                <NavItem key={index} className={bem.e('nav-item')}>
                  <BSNavLink
                    id={`navItem-${name}-${index}`}
                    className="text-uppercase"
                    tag={NavLink}
                    to={to}
                    activeClassName="active"
                    exact={exact}
                  >
                    <Icon className={bem.e('nav-item-icon')} />
                    <span className="">{name}</span>
                  </BSNavLink>
                </NavItem>
              ))}
            </Collapse>

            {/* Master D   */}
            <NavItem
              className={bem.e('nav-item')}
              onClick={this.handleClick('MasterD')}
            >
              <BSNavLink className={bem.e('nav-item-collapse')}>
                <div className="d-flex">
                  <MdAssignment className={bem.e('nav-item-icon')} />
                  <span className="">Master Data D</span>
                </div>
                <MdKeyboardArrowDown
                  className={bem.e('nav-item-icon')}
                  style={{
                    padding: 0,
                    transform: this.state.isOpenMasterD
                      ? 'rotate(0deg)'
                      : 'rotate(-90deg)',
                    transitionDuration: '0.3s',
                    transitionProperty: 'transform',
                  }}
                />
              </BSNavLink>
            </NavItem>
            <Collapse isOpen={this.state.isOpenMasterD}>
              {navMasterDataD.map(({ to, name, exact, Icon }, index) => (
                <NavItem key={index} className={bem.e('nav-item')}>
                  <BSNavLink
                    id={`navItem-${name}-${index}`}
                    className="text-uppercase"
                    tag={NavLink}
                    to={to}
                    activeClassName="active"
                    exact={exact}
                  >
                    <Icon className={bem.e('nav-item-icon')} />
                    <span className="">{name}</span>
                  </BSNavLink>
                </NavItem>
              ))}
            </Collapse>

            {/* Master E   */}
            <NavItem
              className={bem.e('nav-item')}
              onClick={this.handleClick('MasterE')}
            >
              <BSNavLink className={bem.e('nav-item-collapse')}>
                <div className="d-flex">
                  <MdAssignment className={bem.e('nav-item-icon')} />
                  <span className="">Master Data E</span>
                </div>
                <MdKeyboardArrowDown
                  className={bem.e('nav-item-icon')}
                  style={{
                    padding: 0,
                    transform: this.state.isOpenMasterE
                      ? 'rotate(0deg)'
                      : 'rotate(-90deg)',
                    transitionDuration: '0.3s',
                    transitionProperty: 'transform',
                  }}
                />
              </BSNavLink>
            </NavItem>
            <Collapse isOpen={this.state.isOpenMasterE}>
              {navMasterDataE.map(({ to, name, exact, Icon }, index) => (
                <NavItem key={index} className={bem.e('nav-item')}>
                  <BSNavLink
                    id={`navItem-${name}-${index}`}
                    className="text-uppercase"
                    tag={NavLink}
                    to={to}
                    activeClassName="active"
                    exact={exact}
                  >
                    <Icon className={bem.e('nav-item-icon')} />
                    <span className="">{name}</span>
                  </BSNavLink>
                </NavItem>
              ))}
            </Collapse>

            {/* Master F   */}
            <NavItem
              className={bem.e('nav-item')}
              onClick={this.handleClick('MasterF')}
            >
              <BSNavLink className={bem.e('nav-item-collapse')}>
                <div className="d-flex">
                  <MdAssignment className={bem.e('nav-item-icon')} />
                  <span className="">Master Data F</span>
                </div>
                <MdKeyboardArrowDown
                  className={bem.e('nav-item-icon')}
                  style={{
                    padding: 0,
                    transform: this.state.isOpenMasterF
                      ? 'rotate(0deg)'
                      : 'rotate(-90deg)',
                    transitionDuration: '0.3s',
                    transitionProperty: 'transform',
                  }}
                />
              </BSNavLink>
            </NavItem>
            <Collapse isOpen={this.state.isOpenMasterF}>
              {navMasterDataF.map(({ to, name, exact, Icon }, index) => (
                <NavItem key={index} className={bem.e('nav-item')}>
                  <BSNavLink
                    id={`navItem-${name}-${index}`}
                    className="text-uppercase"
                    tag={NavLink}
                    to={to}
                    activeClassName="active"
                    exact={exact}
                  >
                    <Icon className={bem.e('nav-item-icon')} />
                    <span className="">{name}</span>
                  </BSNavLink>
                </NavItem>
              ))}
            </Collapse>

            {/* Master G   */}
            <NavItem
              className={bem.e('nav-item')}
              onClick={this.handleClick('MasterG')}
            >
              <BSNavLink className={bem.e('nav-item-collapse')}>
                <div className="d-flex">
                  <MdAssignment className={bem.e('nav-item-icon')} />
                  <span className="">Master Data G</span>
                </div>
                <MdKeyboardArrowDown
                  className={bem.e('nav-item-icon')}
                  style={{
                    padding: 0,
                    transform: this.state.isOpenMasterG
                      ? 'rotate(0deg)'
                      : 'rotate(-90deg)',
                    transitionDuration: '0.3s',
                    transitionProperty: 'transform',
                  }}
                />
              </BSNavLink>
            </NavItem>
            <Collapse isOpen={this.state.isOpenMasterG}>
              {navMasterDataG.map(({ to, name, exact, Icon }, index) => (
                <NavItem key={index} className={bem.e('nav-item')}>
                  <BSNavLink
                    id={`navItem-${name}-${index}`}
                    className="text-uppercase"
                    tag={NavLink}
                    to={to}
                    activeClassName="active"
                    exact={exact}
                  >
                    <Icon className={bem.e('nav-item-icon')} />
                    <span className="">{name}</span>
                  </BSNavLink>
                </NavItem>
              ))}
            </Collapse>

            {/* Master H   */}
            <NavItem
              className={bem.e('nav-item')}
              onClick={this.handleClick('MasterH')}
            >
              <BSNavLink className={bem.e('nav-item-collapse')}>
                <div className="d-flex">
                  <MdAssignment className={bem.e('nav-item-icon')} />
                  <span className="">Master Data H</span>
                </div>
                <MdKeyboardArrowDown
                  className={bem.e('nav-item-icon')}
                  style={{
                    padding: 0,
                    transform: this.state.isOpenMasterH
                      ? 'rotate(0deg)'
                      : 'rotate(-90deg)',
                    transitionDuration: '0.3s',
                    transitionProperty: 'transform',
                  }}
                />
              </BSNavLink>
            </NavItem>
            <Collapse isOpen={this.state.isOpenMasterH}>
              {navMasterDataH.map(({ to, name, exact, Icon }, index) => (
                <NavItem key={index} className={bem.e('nav-item')}>
                  <BSNavLink
                    id={`navItem-${name}-${index}`}
                    className="text-uppercase"
                    tag={NavLink}
                    to={to}
                    activeClassName="active"
                    exact={exact}
                  >
                    <Icon className={bem.e('nav-item-icon')} />
                    <span className="">{name}</span>
                  </BSNavLink>
                </NavItem>
              ))}
            </Collapse>

            {/* Master I   */}
            <NavItem
              className={bem.e('nav-item')}
              onClick={this.handleClick('MasterI')}
            >
              <BSNavLink className={bem.e('nav-item-collapse')}>
                <div className="d-flex">
                  <MdAssignment className={bem.e('nav-item-icon')} />
                  <span className="">Master Data I</span>
                </div>
                <MdKeyboardArrowDown
                  className={bem.e('nav-item-icon')}
                  style={{
                    padding: 0,
                    transform: this.state.isOpenMasterI
                      ? 'rotate(0deg)'
                      : 'rotate(-90deg)',
                    transitionDuration: '0.3s',
                    transitionProperty: 'transform',
                  }}
                />
              </BSNavLink>
            </NavItem>
            <Collapse isOpen={this.state.isOpenMasterI}>
              {navMasterDataI.map(({ to, name, exact, Icon }, index) => (
                <NavItem key={index} className={bem.e('nav-item')}>
                  <BSNavLink
                    id={`navItem-${name}-${index}`}
                    className="text-uppercase"
                    tag={NavLink}
                    to={to}
                    activeClassName="active"
                    exact={exact}
                  >
                    <Icon className={bem.e('nav-item-icon')} />
                    <span className="">{name}</span>
                  </BSNavLink>
                </NavItem>
              ))}
            </Collapse>

            {/* {navItems2.map(({ to, name, exact, Icon }, index) => (
              <NavItem key={index} className={bem.e('nav-item')}>
                <BSNavLink
                  id={`navItem-${name}-${index}`}
                  className="text-uppercase"
                  tag={NavLink}
                  to={to}
                  activeClassName="active"
                  exact={exact}
                >
                  <Icon className={bem.e('nav-item-icon')} />
                  <span className="">{name}</span>
                </BSNavLink>
              </NavItem>
            ))}

            <NavItem
              className={bem.e('nav-item')}
              onClick={this.handleClick('Components')}
            >
              <BSNavLink className={bem.e('nav-item-collapse')}>
                <div className="d-flex">
                  <MdExtension className={bem.e('nav-item-icon')} />
                  <span className=" align-self-start">Components</span>
                </div>
                <MdKeyboardArrowDown
                  className={bem.e('nav-item-icon')}
                  style={{
                    padding: 0,
                    transform: this.state.isOpenComponents
                      ? 'rotate(0deg)'
                      : 'rotate(-90deg)',
                    transitionDuration: '0.3s',
                    transitionProperty: 'transform',
                  }}
                />
              </BSNavLink>
            </NavItem>
            <Collapse isOpen={this.state.isOpenComponents}>
              {navComponents.map(({ to, name, exact, Icon }, index) => (
                <NavItem key={index} className={bem.e('nav-item')}>
                  <BSNavLink
                    id={`navItem-${name}-${index}`}
                    className="text-uppercase"
                    tag={NavLink}
                    to={to}
                    activeClassName="active"
                    exact={exact}
                  >
                    <Icon className={bem.e('nav-item-icon')} />
                    <span className="">{name}</span>
                  </BSNavLink>
                </NavItem>
              ))}
            </Collapse>

            <NavItem
              className={bem.e('nav-item')}
              onClick={this.handleClick('Contents')}
            >
              <BSNavLink className={bem.e('nav-item-collapse')}>
                <div className="d-flex">
                  <MdSend className={bem.e('nav-item-icon')} />
                  <span className="">Contents</span>
                </div>
                <MdKeyboardArrowDown
                  className={bem.e('nav-item-icon')}
                  style={{
                    padding: 0,
                    transform: this.state.isOpenContents
                      ? 'rotate(0deg)'
                      : 'rotate(-90deg)',
                    transitionDuration: '0.3s',
                    transitionProperty: 'transform',
                  }}
                />
              </BSNavLink>
            </NavItem>
            <Collapse isOpen={this.state.isOpenContents}>
              {navContents.map(({ to, name, exact, Icon }, index) => (
                <NavItem key={index} className={bem.e('nav-item')}>
                  <BSNavLink
                    id={`navItem-${name}-${index}`}
                    className="text-uppercase"
                    tag={NavLink}
                    to={to}
                    activeClassName="active"
                    exact={exact}
                  >
                    <Icon className={bem.e('nav-item-icon')} />
                    <span className="">{name}</span>
                  </BSNavLink>
                </NavItem>
              ))}
            </Collapse>

            <NavItem
              className={bem.e('nav-item')}
              onClick={this.handleClick('Pages')}
            >
              <BSNavLink className={bem.e('nav-item-collapse')}>
                <div className="d-flex">
                  <MdPages className={bem.e('nav-item-icon')} />
                  <span className="">Pages</span>
                </div>
                <MdKeyboardArrowDown
                  className={bem.e('nav-item-icon')}
                  style={{
                    padding: 0,
                    transform: this.state.isOpenPages
                      ? 'rotate(0deg)'
                      : 'rotate(-90deg)',
                    transitionDuration: '0.3s',
                    transitionProperty: 'transform',
                  }}
                />
              </BSNavLink>
            </NavItem>
            <Collapse isOpen={this.state.isOpenPages}>
              {pageContents.map(({ to, name, exact, Icon }, index) => (
                <NavItem key={index} className={bem.e('nav-item')}>
                  <BSNavLink
                    id={`navItem-${name}-${index}`}
                    className="text-uppercase"
                    tag={NavLink}
                    to={to}
                    activeClassName="active"
                    exact={exact}
                  >
                    <Icon className={bem.e('nav-item-icon')} />
                    <span className="">{name}</span>
                  </BSNavLink>
                </NavItem>
              ))}
            </Collapse> */}
          </Nav>
        </div>
      </aside>
    );
  }
}

export default Sidebar;
