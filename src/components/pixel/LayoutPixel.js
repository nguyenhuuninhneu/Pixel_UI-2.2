import React, { Component, useRef } from 'react';
import { Tabs, Card } from '@shopify/polaris';
import Step1 from './steps/Step1';
import Step2 from './steps/Step2';
import Step3 from './steps/Step3';
import CreatePixel from './CreatePixel';
import ManagePixel from './ManagePixel';
import Setting from './Setting';
import ChoosePlan from '../plan/ChoosePlan';
import Setup from '../feed/Setup';
import Help from '../document/Help';
import Dashboard from '../dashboard';
import { FilterProvider } from '../dashboard/Contexts';
import TiktokPixel from "./Tiktok/TiktokPixel";
import moreAppConfig from "../../config/moreAppConfig";
import URLNotFound from '../plugins/URLNotFound';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    NavLink,
    useHistory,
    withRouter
} from "react-router-dom";



const SetTabSelected = (tabSelected) => {
    localStorage.setItem('tab', tabSelected);
    return [
        {
            number: moreAppConfig.Tab.DASHBOARD,
            selected: tabSelected === moreAppConfig.Tab.DASHBOARD ?? true,
            id: 'dashboard',
            content: 'Dashboard'
        },
        {
            number: moreAppConfig.Tab.CREATE_PIXEL,
            selected: tabSelected === moreAppConfig.Tab.CREATE_PIXEL ?? false,
            id: 'create-pixel',
            content: 'Create Pixel'
        },
        {
            number: moreAppConfig.Tab.MANAGE_PIXCEL,
            selected: tabSelected === moreAppConfig.Tab.MANAGE_PIXCEL ?? false,
            id: 'manage-pixel',
            content: 'Manage Pixel'
        },
        {
            number: moreAppConfig.Tab.SETTING,
            selected: tabSelected === moreAppConfig.Tab.SETTING ?? false,
            id: 'setting',
            content: 'Setting'
        },
        {
            number: moreAppConfig.Tab.PLAN,
            selected: tabSelected === moreAppConfig.Tab.PLAN ?? false,
            id: 'plan',
            content: 'Plan'
        },
        {
            number: moreAppConfig.Tab.FEED_PIXEL,
            selected: tabSelected === moreAppConfig.Tab.FEED_PIXEL ?? false,
            id: 'feed',
            content: 'Facebook Product Feed'
        },
        {
            number: moreAppConfig.Tab.HELP,
            selected: tabSelected === moreAppConfig.Tab.HELP ?? false,
            id: 'help',
            content: 'Help'
        },
        {
            number: moreAppConfig.Tab.TIKTOK_PIXEL,
            selected: tabSelected === moreAppConfig.Tab.TIKTOK_PIXEL ?? false,
            id: 'tiktok-pixel',
            content: 'Tiktok Pixels'
        },
    ]
}

class LayoutPixel extends Component {

    constructor(props) {
        super(props);
        this.props.onRef(this);
        //var tabSelected = this.props.selectedTab;
        var tabSelected = localStorage.getItem('tab') ? parseInt(localStorage.getItem('tab')) : moreAppConfig.Tab.DASHBOARD;
        var slug = this.props.match.params.slug;
        this.state = {
            TabIndex: 0,
            tabs: SetTabSelected(tabSelected)
        }
        this.callbackStepSetupChange = this.callbackStepSetupChange.bind(this);
    }

    callbackPixelStepSetupFunction = (pixel) => {
        
        this.props.AppCallbackShopFuntion({
            ...this.props.shop,
            StepSetup: 1,
            pixelStepSetup: pixel
        });
        this.setState({
            tabs: SetTabSelected(moreAppConfig.Tab.CREATE_PIXEL)
        });
        this.props.history.push('/' + moreAppConfig.UrlSystem.STEP_2 + '?shop=' + this.props.shop?.Domain + '&admin=1');
    }


    callbackStepSetupChange = (stepSetup) => {
        this.setState({
            tabs: SetTabSelected(moreAppConfig.Tab.CREATE_PIXEL)
        })
        if (stepSetup === 3) {
            this.props.AppCallbackShopFuntion({
                ...this.props.shop,
                StepSetup: stepSetup,
                pixelStepSetup: null,
                pixelStepSetupName: this.props.shop.pixelStepSetup.Title
            });
            this.props.history.push('/' + moreAppConfig.UrlSystem.STEP_3 + '?shop=' + this.props.shop?.Domain + '&admin=1');
        }
        else if (stepSetup === 4) {
            this.props.AppCallbackShopFuntion({
                ...this.props.shop,
                StepSetup: 0,
                pixelStepSetup: null
            });
            this.props.history.push('/' + moreAppConfig.UrlSystem.NO_STEP + '?shop=' + this.props.shop?.Domain + '&admin=1');
        }
        else {
            this.props.AppCallbackShopFuntion({
                ...this.props.shop,
                StepSetup: stepSetup
            });
            this.props.history.push('/' + moreAppConfig.UrlSystem.STEP_1 + '?shop=' + this.props.shop?.Domain + '&admin=1');
        }

    };

    callbackSelectedTabCreateChange = (selected, pixel) => {
        
        if (pixel != null) {
            this.props.history.push('/' + moreAppConfig.UrlSystem.UPDATE_PIXEL + '/' + pixel.ID + '?shop=' + this.props.shop?.Domain + '&admin=1');

            this.setState({
                tabs: SetTabSelected(selected)
            })
        }
        else {
            this.props.history.push('/' + moreAppConfig.UrlSystem.CREATE_PIXEL + '?shop=' + this.props.shop?.Domain + '&admin=1');
            this.setState({
                tabs: SetTabSelected(selected)
            })
        }
        this.props.AppCallbackSelectedTabCreateFunction(selected, pixel);


    }

    callbackSelectedTabChange = (selected) => {
        this.setState({
            tabs: SetTabSelected(selected)
        })
        this.props.AppCallbackSelectedTabFunction(selected);

    }

    callbackSavePixelSuccess = () => {
        this.setState({
            tabs: SetTabSelected(moreAppConfig.Tab.CREATE_PIXEL)
        })
        this.props.AppCallbackAfterSavePixelSuccess();

    }


    callbackIsShowPlanFuntion = (isShowPlan) => {
        this.props.AppCallbackIsShowPlanFuntion(isShowPlan);
    }
    handleSetOnlyTabChange = (selected) => {
        this.setState({
            tabs: SetTabSelected(selected)
        })
    }
    handleTabChange = (selected) => {
        
        // window.localStorage.setItem('tab', selected);
        this.setState({
            tabs: SetTabSelected(selected)
        })
        if (selected === 0) {
            this.props.AppCallbackCheckPlanCreatePixelFunction();
        }
        else {
            this.props.AppCallbackSelectedTabFunction(selected);
        }


    };
    render() {
        return (
            <>
                <div className="Polaris-Tabs__Wrapper">
                    <ul role="tablist" className="Polaris-Tabs">
                        {this.state.tabs.map((item) => {
                            return (
                                <li tabindex={item.number} className="Polaris-Tabs__TabContainer" role="presentation">
                                    <button ref={this.props.ref} id={item.id} role="tab" type="button" tabindex="0" className={item.selected ? "Polaris-Tabs__Tab Polaris-Tabs__Tab--selected" : "Polaris-Tabs__Tab"} aria-selected="true" aria-controls="create-pixel-panel"
                                        onClick={() => {
                                            this.handleTabChange(item.number);
                                            var path = item.id;
                                            if (item.number === 1) {
                                                switch (this.props.shop.StepSetup) {
                                                    case 0:
                                                        path = moreAppConfig.UrlSystem.STEP_1;
                                                        break;
                                                    case 1:
                                                        path = moreAppConfig.UrlSystem.STEP_2;
                                                        break;
                                                    case 2:
                                                        break;
                                                    case 3:
                                                        path = moreAppConfig.UrlSystem.STEP_3;
                                                        break;
                                                    default:
                                                        break;
                                                }
                                            }
                                            this.props.history.push('/' + path + '?shop=' + this.props.shop?.Domain + '&admin=1');

                                        }}
                                    ><span className="Polaris-Tabs__Title">{item.content}</span></button>
                                </li>
                            )
                        })}
                    </ul>
                </div>

                <Switch>
                    <Route exact path='/dashboard'>
                        <Card.Section>
                            <FilterProvider>
                                <Dashboard onSelectedTabs={this.props.onSelectedTabs} onSelectedShop={this.props.onSelectedShop} shop={this.props.shop?.Domain}></Dashboard>
                            </FilterProvider>
                        </Card.Section>
                    </Route>
                    <Route exact path='/create-pixel/step-1'>
                        <Card.Section>
                            <Step1 shop={this.props.shop} setting={this.props.setting} pixelStepSetup={this.props.pixelStepSetup}
                                callbackStepSetupChange={this.callbackStepSetupChange}
                                callbackSelectedTabChange={this.callbackSelectedTabChange}
                                callbackPixelStepSetupFunction={this.callbackPixelStepSetupFunction}
                                AppCallbackSettingFuntion={this.props.AppCallbackSettingFuntion}></Step1>
                        </Card.Section>
                    </Route>
                    <Route exact path='/create-pixel/step-2'>
                        <Card.Section>
                            <Step2 shop={this.props.shop} setting={this.props.setting} pixelStepSetup={this.props.pixelStepSetup} callbackStepSetupChange={this.callbackStepSetupChange} ></Step2>
                        </Card.Section>
                    </Route>
                    <Route exact path='/create-pixel/step-3'>
                        <Card.Section>
                            <Step3 shop={this.props.shop} setting={this.props.setting} pixelStepSetupName={this.props.shop.pixelStepSetupName}
                                callbackStepSetupChange={this.callbackStepSetupChange}
                                callbackSelectedTabChange={this.callbackSelectedTabChange}
                                callbackSelectedTabCreateChange={this.callbackSelectedTabCreateChange}
                                AppCallbackCheckPlanCreatePixelFunction={this.props.AppCallbackCheckPlanCreatePixelFunction}></Step3>
                        </Card.Section>
                    </Route>
                    <Route exact path='/create-pixel'>
                        <Card.Section>
                            <CreatePixel shop={this.props.shop} setting={this.props.setting} pixelEdit={this.props.pixelEdit}
                                callbackSelectedTabChange={this.callbackSelectedTabChange}
                                callbackIsShowPlanFuntion={this.callbackIsShowPlanFuntion}
                                callbackSavePixelSuccess={this.callbackSavePixelSuccess}></CreatePixel>
                        </Card.Section>
                    </Route>
                    <Route exact path='/update-pixel/:slug'>
                        <Card.Section>
                            <CreatePixel shop={this.props.shop} setting={this.props.setting} pixelEdit={this.props.pixelEdit}
                                callbackSelectedTabChange={this.callbackSelectedTabChange}
                                callbackIsShowPlanFuntion={this.callbackIsShowPlanFuntion}
                                callbackSavePixelSuccess={this.callbackSavePixelSuccess}></CreatePixel>
                        </Card.Section>
                    </Route>
                    <Route exact path='/manage-pixel'>
                        <Card.Section>
                            <ManagePixel shop={this.props.shop} setting={this.props.setting} hasRating={this.props.hasRating} isCompleteSave={this.props.isCompleteSave}
                                AppCallbackWriteQuickReview={this.props.AppCallbackWriteQuickReview}
                                AppCallBackIsCompleteSave={this.props.AppCallBackIsCompleteSave}
                                callbackStepSetupChange={this.callbackStepSetupChange}
                                callbackSelectedTabChange={this.callbackSelectedTabChange}
                                callbackSelectedTabCreateChange={this.callbackSelectedTabCreateChange}
                                AppCallbackCheckPlanCreatePixelFunction={this.props.AppCallbackCheckPlanCreatePixelFunction}
                                AppCallbackPixelCountFunction={this.props.AppCallbackPixelCountFunction}></ManagePixel>
                        </Card.Section>
                    </Route>
                    <Route exact
                        path='/setting'>
                        <Card.Section>
                            <Setting shop={this.props.shop} setting={this.props.setting} AppCallbackSettingFuntion={this.props.AppCallbackSettingFuntion}></Setting>
                        </Card.Section>
                    </Route>
                    <Route exact
                        path='/plan'>
                        <Card.Section>
                            <div className={'plan'}>
                                <ChoosePlan shop={this.props.shop} setting={this.props.setting}
                                    AppCallbackIsShowPlanFuntion={this.props.AppCallbackIsShowPlanFuntion}
                                    AppCallbackIsLoadingFuntion={this.props.AppCallbackIsLoadingFuntion}
                                    AppCallbackShopFuntion={this.props.AppCallbackShopFuntion}
                                    AppCallbackSettingFuntion={this.props.AppCallbackSettingFuntion} />
                            </div>
                        </Card.Section>
                    </Route>
                    <Route exact
                        path='/feed'>
                        <Card.Section>
                            <Setup shop={this.props.shop} setting={this.props.setting} feed={this.props.feed}
                                AppCallbackShopFuntion={this.props.AppCallbackShopFuntion}
                                AppCallbackFeedFuntion={this.props.AppCallbackFeedFuntion}></Setup>
                        </Card.Section>
                    </Route>
                    <Route exact
                        path='/help'>
                        <Card.Section>
                            <Help shop={this.props.shop} setting={this.props.setting}></Help>
                        </Card.Section>
                    </Route>
                    <Route exact
                        path='/tiktok-pixel'>
                        <Card.Section>
                            <TiktokPixel shop={this.props.shop} />
                        </Card.Section>
                    </Route>
                    <Route exact
                        path='/manage-campaign'>
                    </Route>
                    <Route
                        path="*"
                    >
                        <URLNotFound />
                    </Route>
                </Switch>
            </>

        )


    }



}

export default withRouter(LayoutPixel);