import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CPagination,
  CLink,
  CCollapse,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CDropdownDivider,
  CInput,
  CButton,
  CForm
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import Highcharts from 'highcharts';
import HighchartsMap from 'highcharts/highmaps';
import HighchartsReact from 'highcharts-react-official';
import HeatMap from 'react-heatmap-grid';
import mapDataWorld from '@highcharts/map-collection/custom/world.geo.json';
import API from "../utils/api"
import Select from "react-dropdown-select";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

require('highcharts/modules/exporting')(Highcharts);

const Dashboard = (props = HighchartsReact.Props) => {

  const [collapsed1, setCollapsed1] = React.useState(true)
  const [collapsed2, setCollapsed2] = React.useState(true)
  const [collapsed3, setCollapsed3] = React.useState(true)

  const [listapp, setListapp] = useState([]);
  const [listweb, setListweb] = useState([]);
  const [datapointWeb, setdatapointWeb] = useState([]);
  const [datapointApp, setdatapointApp] = useState([]);
  const [categoriesWeb, setCategoriesWeb] = useState([]);
  const [categoriesApp, setCategoriesApp] = useState([]);
  const [collections, setCollections] = useState([]);
  const [currentpageWeb, setCurrenpageWeb] = useState(1);
  const [totalpagesWeb, setTotalpagesWeb] = useState(1);
  const [totalWeb, setTotalWeb] = useState(0);
  const [currentpageApp, setCurrenpageApp] = useState(1);
  const [totalpagesApp, setTotalpagesApp] = useState(1);
  const [totalApp, setTotalApp] = useState(0);
  const [teamID, setTeamID] = useState("");

  const [loading, setLoading] = useState(true);

  const [collapsedDropdown, setCollapsedDropdown] = useState(false);
  const [collapsedCustom, setCollapsedCustom] = useState(false);

  const [fromDate, setFromDate] = useState(0);
  const [toDate, setToDate] = useState(Math.ceil(Date.now() / 1000));

  const[dateType, setDateType] = useState('');

  var data_heat= [];
  for(var i = 0; i < 24; i++){
    data_heat.push([1, 1, 1, 1, 1, 1, 1])
  }
  const[dataHeat, setDataHeat] = useState(data_heat);

  const limit = 15;

  useEffect(() => {
    setLoading(true);
    getCollections();
    var team_id = '';
    const authType = localStorage.getItem('authType');
    if(authType === ''){
      const usr = localStorage.getItem('authUser');
      const log_usr = JSON.parse(usr);
      team_id = log_usr.team_id;
      setTeamID(team_id);
    }
      
  }, [])

  const getCollections = () => {
    const authType = localStorage.getItem('authType');
    var team_id = '';
    if(authType === ''){
      const usr = localStorage.getItem('authUser');
      const log_usr = JSON.parse(usr);
      team_id = log_usr.team_id;
    }
    API.track().fetchCollections()
    .then(res => {
      var arr = res.data.filter(col => (col !== 'users'))
      var select_arr = arr.map(col => {
        
        if(team_id === col){
          return {label : col + " (YOU)", value : col}
        }
        else{
          return {label : col, value : col}
        }
      })
      setCollections(select_arr);
      
      if(team_id === ''){
        setTeamID(arr[0]);
        getListData(arr[0], currentpageApp, limit, 1, fromDate, toDate);
        getListData(arr[0], currentpageWeb, limit, 0, fromDate, toDate);
      }
      else{
        var log = false;
        log = res.data.find(col => (col === team_id))
        if(log){
          setTeamID(team_id);
          getListData(team_id, currentpageApp, limit, 1, fromDate, toDate);
          getListData(team_id, currentpageWeb, limit, 0, fromDate, toDate);
        }
        else{
          setTeamID(res.data[0]);
          getListData(res.data[0], currentpageApp, limit, 1, fromDate, toDate);
          getListData(res.data[0], currentpageWeb, limit, 0, fromDate, toDate);
        }
      }
    })
    .catch(err => console.log(err))
  }
  const getListData = (team_id, page, limit, status, from, to) => {
    setLoading(true)
    var count = 0;
  
    API.track().fetchTimeHistory(team_id)
      .then(res => {
        setDataHeat(res.data.result);
      })
      .catch(err => console.log(err))
    API.track().fetchPaginate(team_id, page, limit, status, from, to)
      .then(res =>{
        if(status === 0){
          setListweb(res.data.result);
          setTotalWeb(res.data.count);
          count = Math.ceil(res.data.count/limit)
          if(count < 1) count = 1;

          setTotalpagesWeb(count);
          const arr = res.data.result.map(web => {
            return [web.application, parseInt(web.active)];
          })
          const cats = res.data.result.map(cat => {
            return cat.application;
          })
          setCategoriesWeb(cats);
          setdatapointWeb(arr);
        }
        else{
          setListapp(res.data.result);
          setTotalApp(res.data.count);
          count = Math.ceil(res.data.count/limit)
          if(count < 1) count = 1;
          setTotalpagesApp(count);
          const arr = res.data.result.map(app => {
            return [app.application, parseInt(app.active)];
          })
          const cats = res.data.result.map(cat => {
            return cat.application;
          })
          setCategoriesApp(cats);
          setdatapointApp(arr);
        }
        setLoading(false)
      })
      .catch(err => console.log(err))
  }

  const pageChange_web = newPage => {
    if(currentpageWeb !== newPage){
      setCurrenpageWeb(newPage);
      getListData(teamID, newPage, limit, 0, fromDate, toDate); 
    }
  }

  const pageChange_app = newPage => {
    if(currentpageApp !== newPage){
      setCurrenpageApp(newPage);
      getListData(teamID, newPage, limit, 1, fromDate, toDate);
    }
  }

  const optionsWeb: Highcharts.Options = {
    exporting: {
      chartOptions: { // specific options for the exported image
          plotOptions: {
              series: {
                  dataLabels: {
                      enabled: true
                  }
                  
              }
          }
      },
      fallbackToExportServer: false,
      filename : "Website active time chart",
    },
    title: {
        text: ''
    },
    xAxis: {
      categories: categoriesWeb
    },
    series: [{
        name: 'web sites',
        type: 'bar',
        colorByPoint: true,
        data: datapointWeb
    }]
  }

  const optionsApp: Highcharts.Options = {
    exporting: {
      chartOptions: { // specific options for the exported image
          plotOptions: {
              series: {
                  dataLabels: {
                      enabled: true
                  }
                  
              }
          }
      },
      fallbackToExportServer: false,
      filename : "Apps active time chart",
    },
    title: {
        text: ''
    },
    xAxis: {
      categories: categoriesApp
    },
    series: [{
        name: 'apps',
        type: 'bar',
        colorByPoint: true,
        data: datapointApp
    }]
  }

  // const yLabels = new Array(24).fill(0).map((_, i) => `${i % 2 === 0 ? i : ''}`);
  const yLabels = ['12am', '', '2am', '', '4am', '', '6am', '', '8am', '', '10am', '', '12pm', '', '2pm', '', '4pm', '', '6pm', '', '8pm', '', '10pm', '']
  const xLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  // const data_heat = new Array(yLabels.length)
  //   .fill(0)
  //   .map(() => new Array(xLabels.length).fill(0).map(() => Math.floor(Math.random() * 100)));
  
 
  var data_map: [string, number][] = [
    ['fo', 0],
    ['um', 1],
    ['us', 2],
    ['jp', 3],
    ['sc', 4],
    ['in', 5],
    ['fr', 6],
    ['fm', 7],
    ['cn', 8],
    ['pt', 9],
    ['sw', 10],
    ['sh', 11],
    ['br', 12],
    ['ki', 13],
    ['ph', 14],
    ['mx', 15],
    ['es', 16],
    ['bu', 17],
    ['mv', 18],
    ['sp', 19],
    ['gb', 20],
    ['gr', 21],
    ['as', 22],
    ['dk', 23],
    ['gl', 24],
    ['gu', 25],
    ['mp', 26],
    ['pr', 27],
    ['vi', 28],
    ['ca', 29],
    ['st', 30],
    ['cv', 31],
    ['dm', 32],
    ['nl', 33],
    ['jm', 34],
    ['ws', 35],
    ['om', 36],
    ['vc', 37],
    ['tr', 38],
    ['bd', 39],
    ['lc', 40],
    ['nr', 41],
    ['no', 42],
    ['kn', 43],
    ['bh', 44],
    ['to', 45],
    ['fi', 46],
    ['id', 47],
    ['mu', 48],
    ['se', 49],
    ['tt', 50],
    ['my', 51],
    ['pa', 52],
    ['pw', 53],
    ['tv', 54],
    ['mh', 55],
    ['cl', 56],
    ['th', 57],
    ['gd', 58],
    ['ee', 59],
    ['ag', 60],
    ['tw', 61],
    ['bb', 62],
    ['it', 63],
    ['mt', 64],
    ['vu', 65],
    ['sg', 66],
    ['cy', 67],
    ['lk', 68],
    ['km', 69],
    ['fj', 70],
    ['ru', 71],
    ['va', 72],
    ['sm', 73],
    ['kz', 74],
    ['az', 75],
    ['tj', 76],
    ['ls', 77],
    ['uz', 78],
    ['ma', 79],
    ['co', 80],
    ['tl', 81],
    ['tz', 82],
    ['ar', 83],
    ['sa', 84],
    ['pk', 85],
    ['ye', 86],
    ['ae', 87],
    ['ke', 88],
    ['pe', 89],
    ['do', 90],
    ['ht', 91],
    ['pg', 92],
    ['ao', 93],
    ['kh', 94],
    ['vn', 95],
    ['mz', 96],
    ['cr', 97],
    ['bj', 98],
    ['ng', 99],
    ['ir', 100],
    ['sv', 101],
    ['sl', 102],
    ['gw', 103],
    ['hr', 104],
    ['bz', 105],
    ['za', 106],
    ['cf', 107],
    ['sd', 108],
    ['cd', 109],
    ['kw', 110],
    ['de', 111],
    ['be', 112],
    ['ie', 113],
    ['kp', 114],
    ['kr', 115],
    ['gy', 116],
    ['hn', 117],
    ['mm', 118],
    ['ga', 119],
    ['gq', 120],
    ['ni', 121],
    ['lv', 122],
    ['ug', 123],
    ['mw', 124],
    ['am', 125],
    ['sx', 126],
    ['tm', 127],
    ['zm', 128],
    ['nc', 129],
    ['mr', 130],
    ['dz', 131],
    ['lt', 132],
    ['et', 133],
    ['er', 134],
    ['gh', 135],
    ['si', 136],
    ['gt', 137],
    ['ba', 138],
    ['jo', 139],
    ['sy', 140],
    ['mc', 141],
    ['al', 142],
    ['uy', 143],
    ['cnm', 144],
    ['mn', 145],
    ['rw', 146],
    ['so', 147],
    ['bo', 148],
    ['cm', 149],
    ['cg', 150],
    ['eh', 151],
    ['rs', 152],
    ['me', 153],
    ['tg', 154],
    ['la', 155],
    ['af', 156],
    ['ua', 157],
    ['sk', 158],
    ['jk', 159],
    ['bg', 160],
    ['qa', 161],
    ['li', 162],
    ['at', 163],
    ['sz', 164],
    ['hu', 165],
    ['ro', 166],
    ['ne', 167],
    ['lu', 168],
    ['ad', 169],
    ['ci', 170],
    ['lr', 171],
    ['bn', 172],
    ['iq', 173],
    ['ge', 174],
    ['gm', 175],
    ['ch', 176],
    ['td', 177],
    ['kv', 178],
    ['lb', 179],
    ['dj', 180],
    ['bi', 181],
    ['sr', 182],
    ['il', 183],
    ['ml', 184],
    ['sn', 185],
    ['gn', 186],
    ['zw', 187],
    ['pl', 188],
    ['mk', 189],
    ['py', 190],
    ['by', 191],
    ['cz', 192],
    ['bf', 193],
    ['na', 194],
    ['ly', 195],
    ['tn', 196],
    ['bt', 197],
    ['md', 198],
    ['ss', 199],
    ['bw', 200],
    ['bs', 201],
    ['nz', 202],
    ['cu', 203],
    ['ec', 204],
    ['au', 205],
    ['ve', 206],
    ['sb', 207],
    ['mg', 208],
    ['is', 209],
    ['eg', 210],
    ['kg', 211],
    ['np', 212]
  ];

  const optionsMap = {
    title: {
      text: 'Sessions by country',
      align: 'left'
    },
    series: [
        {
          mapData: mapDataWorld,
          data: data_map,
          name: '',
          dataLabels: {
            enabled: false,
          }
        }
    ],
  }

  const optionsDevice = {
      chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie'
      },
      exporting: {
        chartOptions: { // specific options for the exported image
            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: true
                    }
                    
                }
            }
        },
        fallbackToExportServer: false,
        filename : "Device session chart",
      },
      title: {
          text: 'Sessions by device',
          align: 'left'
      },
      tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      accessibility: {
          point: {
              valueSuffix: '%'
          }
      },
      plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            showInLegend: true,
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b><br>{point.percentage:.1f} %',
                distance: -50,
                filter: {
                    property: 'percentage',
                    operator: '>',
                    value: 4
                }
            }
        }
    },
      series: [{
          name: 'device',
          colorByPoint: true,
          data: [{
              name: 'Web',
              y: totalWeb,
              sliced: true,
              selected: true
          }, {
              name: 'Desktop',
              y: totalApp
          }]
      }]
  }

  const setSelectCollection = values => {
    if(values.length > 0){
      const team_id = values[0].value;
      setTeamID(team_id)
      setCurrenpageWeb(1);
      setCurrenpageApp(1);
      getListData(team_id, 1, limit, 1, fromDate, toDate);
      getListData(team_id, 1, limit, 0, fromDate, toDate);
    }
    
  }

  const setReportsDate = (type, diff) => {
    var to = Math.ceil(Date.now() / 1000);
    var from = 0;
    setDateType(type);

    if(type !== 'custom'){
      from = to - diff;
      setFromDate(from);
      getListData(teamID, currentpageApp, limit, 1, from, to);
      getListData(teamID, currentpageWeb, limit, 0, from, to);
    }
    else{
      
      getListData(teamID, currentpageApp, limit, 1, fromDate, toDate);
      getListData(teamID, currentpageWeb, limit, 0, fromDate, toDate);
    }
  }

  const setCustomFromDate = (time) => {
    if(time){
      var date = new Date(time).getTime() / 1000;
      setFromDate(date);
    }
    else{
      setFromDate(0);
    }
  }

  const setCustomToDate = (time) => {
    if(time){
      var date = new Date(time).getTime() / 1000;
      setToDate(date);
    }
    else{
      setToDate(Math.ceil(Date.now() / 1000));
    }
    
  }

  return (
    <>

      <CCard>
        <CCardHeader>
        {
          !loading && (
              <Loader
                type="Bars"
                color="#00BFFF"
                height={45}
                width={100}
                timeout={0}
                visible={loading}
                className="load-div"
              />
          )
        }
        <div className="card-header-actions">
          <CRow>
            <CCol xl={6}>
              <CDropdown className="m-1">
                <CDropdownToggle className="dropdown-toggle">
                  Get reports by date
                </CDropdownToggle>
                <CDropdownMenu className="dropdown-menu">
                  <CDropdownItem className={dateType === 'last30' ? 'active-dropdown' : ''} onClick={() => setReportsDate("last30", 2592000)}>
                    Last 30 days
                  </CDropdownItem>
                  <CDropdownDivider />
                  <CDropdownItem className={dateType === 'last7' ? 'active-dropdown' : ''} onClick={() => setReportsDate("last7", 604800)}>Last 7 days</CDropdownItem>
                  <CDropdownItem className={dateType === 'last15' ? 'active-dropdown' : ''} onClick={() => setReportsDate("last15", 1296000)}>Last 15 days</CDropdownItem>
                  <div onClick={() => setCollapsedDropdown(!collapsedDropdown)} className="dropdown-more">
                    <b><span>More preset ranges . . .  
                        <CIcon name={collapsedDropdown ? 'cil-chevron-bottom':'cil-chevron-top'} className="dropdown-collapse-icon" />
                    </span></b>
                  </div>
                  <CCollapse show={collapsedDropdown}>
                    <CDropdownItem className={dateType === 'last60' ? 'active-dropdown' : ''} onClick={() => setReportsDate("last60", 5184000)}>Last 60 days</CDropdownItem>
                    <CDropdownItem className={dateType === 'last90' ? 'active-dropdown' : ''} onClick={() => setReportsDate("last90", 7776000)}>Last 90 days</CDropdownItem>
                  </CCollapse>
                  <CDropdownDivider />
                  <div onClick={() => setCollapsedCustom(!collapsedCustom)} className={dateType === 'custom' ? 'active-dropdown dropdown-more' : 'dropdown-more'}><b>Custom . . .</b>
                      <CIcon name={collapsedCustom ? 'cil-chevron-bottom':'cil-chevron-top'} className="dropdown-collapse-icon" />
                  </div>
                  <div style={{padding: '0px 15px'}}>                    
                    <CCollapse show={collapsedCustom}>
                      <CForm className="was-validated">
                        From:
                        <CInput onChange={e => setCustomFromDate(e.target.value)} type="date" required/>
                        To:
                        <CInput onChange={e => setCustomToDate(e.target.value)} type="date" required/> 
                        <CButton onClick={() => setReportsDate("custom", 0)} color="info" className="mt-3" style={{float: 'right', padding: '0'}}>
                          <CDropdownItem className="dropdown-report">Get reports</CDropdownItem>
                        </CButton>  
                      </CForm>
                    </CCollapse>
                  </div>
                  </CDropdownMenu>
              </CDropdown>
            </CCol>
            <CCol xl={6} style={{paddingTop : '4px', paddingRight : '55px'}}>
              <Select values={collections.filter(col => col.value === teamID)} options={collections} onChange={(values) => setSelectCollection(values)} style={{width : '220px'}}/>
            </CCol>
          </CRow>
          
        </div>
        </CCardHeader>
        
        {
          true && (
            <CCardBody>
              <CCard accentColor="primary">
                <CCardHeader>
                  <b>Data source</b>
                  <div className="card-header-actions">
                    <CLink className="card-header-action" onClick={() => setCollapsed1(!collapsed1)}>
                      <CIcon name={collapsed1 ? 'cil-chevron-bottom':'cil-chevron-top'} />
                    </CLink>
                  </div>
                </CCardHeader>
                <CCollapse show={collapsed1}>
                <CCardBody>
                  <CRow>
                    <CCol xl={6}>

                          <h5>Users by time of day</h5>
                          <br/>
                          <HeatMap
                            xLabels={xLabels}
                            yLabels={yLabels}
                            data={dataHeat}
                            height={15}
                            xLabelsLocation='bottom'
                            yLabelWidth={50}
                          />,
                    </CCol>
                    {/* <CCol xl={4}>
                        <div id='mapChart'>
                          <HighchartsReact
                              options={optionsMap}
                              highcharts = { HighchartsMap   }
                              constructorType={'mapChart'}
                                      {...props}
                          />
                          </div>
                    </CCol> */}
                    <CCol xl={6}>
                          <HighchartsReact
                            options={optionsDevice}
                            highcharts = { Highcharts }
                                    {...props}
                          />
                    </CCol>
                  </CRow>
                </CCardBody>
                </CCollapse>
              </CCard>
              <CCard accentColor="success">
                <CCardHeader>
                    <b>Most visited websites (Active Time)</b>
                    <div className="card-header-actions">
                      <CLink className="card-header-action" onClick={() => setCollapsed2(!collapsed2)}>
                        <CIcon name={collapsed2 ? 'cil-chevron-bottom':'cil-chevron-top'} />
                      </CLink>
                    </div>
                </CCardHeader>
                <CCollapse show={collapsed2}>
                {
                listweb.length !== 0 && (
                  <CCardBody>                    
                    <HighchartsReact
                          options={optionsWeb}
                          highcharts = { Highcharts }
                                  {...props}
                    />
                    <CPagination
                      activePage={currentpageWeb}
                      onActivePageChange={pageChange_web}
                      pages={totalpagesWeb}
                      doubleArrows={true} 
                      align="center"
                    />
                  </CCardBody>
                  )
                  
                }
                {
                listweb.length === 0 && (
                  <CCardBody style={{textAlign : 'center'}}>
                    There is no data of most visited websites active time.
                  </CCardBody>
                  )
                  
                }
                </CCollapse>
              </CCard>
              <CCard accentColor="info">
                <CCardHeader>
                    <b>Most used applications (Active Time)</b>
                    <div className="card-header-actions">
                      <CLink className="card-header-action" onClick={() => setCollapsed3(!collapsed3)}>
                        <CIcon name={collapsed3 ? 'cil-chevron-bottom':'cil-chevron-top'} />
                      </CLink>
                    </div>
                </CCardHeader>
                <CCollapse show={collapsed3}>
                {
                listapp.length !== 0 && (
                  <CCardBody>
                    <HighchartsReact
                          options={optionsApp}
                          highcharts = { Highcharts }
                                  {...props}
                    />
                    <CPagination
                      activePage={currentpageApp}
                      onActivePageChange={pageChange_app}
                      pages={totalpagesApp}
                      doubleArrows={true} 
                      align="center"
                    />
                  </CCardBody>
                  )
                  
                }
                {
                listapp.length === 0 && (
                  <CCardBody style={{textAlign : 'center'}}>
                    There is no data of most used applications active time.
                  </CCardBody>
                  )
                  
                }
                </CCollapse>
              </CCard>
          </CCardBody>
          )
        }
        
      </CCard>
    </>
  )
}

export default Dashboard
