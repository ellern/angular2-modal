import { Component, provide, ElementRef, Injector, Renderer} from 'angular2/core';

import {ModalDialogInstance, ModalConfig, Modal, ICustomModal,
    YesNoModalContent, YesNoModal} from 'angular2-modal';

import {AdditionCalculateWindowData, AdditionCalculateWindow} from '../customModalDemo/customModal';

import {SampleElement} from '../sampleElement/sampleElement';

@Component({
    selector: 'demo-page',
    directives: [SampleElement],
    providers: [Modal],
    styles: [ require('./demoPage.css') ],
    template: require('./demoPage.tpl.html')
})

export class DemoPage {
    public mySampleElement: ElementRef;
    public lastModalResult: string;

    constructor(private modal: Modal, private elementRef: ElementRef,
                private injector: Injector, private _renderer: Renderer) {}

    /* tslint:disable */
    // We defaulted quit key to 81 at app bootstrap, to make it 27 we have to specify it for each modal config
    static modalConfigs = {
        'large': new ModalConfig("lg", false, 27),
        'small': new ModalConfig("sm", false, 27),
        'yesno': new ModalConfig("sm", false, 27),
        'key': undefined, // Modal will use default config, which we set at app bootstrap (setting in app bootstrap is optional)
        'blocking': new ModalConfig("lg", true, null), // null for keyboard means no keyboard keys can close the modal.
        'inElement': new ModalConfig("lg", true, null),
        'customWindow': new ModalConfig("lg", true, 27)
    };
    static modalData = {
        'large': new YesNoModalContent('Simple Large modal', 'Press ESC or click OK / outside area to close.', true),
        'small': new YesNoModalContent('Simple Small modal', 'Press ESC or click OK / outside area to close.', true),
        'yesno': new YesNoModalContent('Simple 2 button custom modal', 'Answer the question', false, "Yes", "No"),
        'key': new YesNoModalContent('Special Exit Key', 'Press q to close.', true),
        'blocking': new YesNoModalContent('Simple Blocking modal', 'You can only click OK to close this modal.', true),
        'inElement':new YesNoModalContent('Simple In Element modal', 'Try stacking more modals, click OK to close.', true),
        'customWindow': new AdditionCalculateWindowData(2, 3)
    };
    /* tslint:enable */

    openDialog(type: string) {
        this.modal.alert()
            .modalConfig(new ModalConfig('sm', false, 27))
            .title('Hello')
            .content('World')
            .ok('EXIT')
            .open()
            .then((mdi: ModalDialogInstance) => {
                mdi.result.then(() => alert('ok'));
            });
        return;
        let dialog:  Promise<ModalDialogInstance>;
        let component = (type === 'customWindow') ? AdditionCalculateWindow : YesNoModal;
        let bindings = Injector.resolve([
            provide(ICustomModal, {useValue: DemoPage.modalData[type]})
        ]);

        if (type === 'inElement') {
            dialog = this.modal.openInside(
                <any>component,
                this.mySampleElement,
                'myModal',
                bindings,
                DemoPage.modalConfigs[type]);
        } else
            dialog = this.modal.open(
                <any>component,
                bindings,
                DemoPage.modalConfigs[type]);


        dialog.then((resultPromise) => {
            return resultPromise.result.then((result) => {
                this.lastModalResult = result;
            }, () => this.lastModalResult = 'Rejected!');
        });
    }
}
