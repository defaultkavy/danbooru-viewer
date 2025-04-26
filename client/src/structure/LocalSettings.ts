export class LocalSettings {
    static get localdata() { const data = localStorage.getItem('local_settings_data'); return data ? JSON.parse(data) as LocalSettingsStoreData : null }
    static set localdata(data: LocalSettingsStoreData | null) { localStorage.setItem('local_settings_data', JSON.stringify(data)) }
    
    static columnSize$ = $.state(this.localdata?.columnSizeDelta ?? 0).on('update', state$ => this.localdata = {...this.localdata, columnSizeDelta: state$.value()})
    static detailPanelEnable$ = $.state(this.localdata?.detailPanelEnabled ?? true).on('update', state$ => this.localdata = {...this.localdata, detailPanelEnabled: state$.value()})
    static previewPanelEnable$ = $.state(this.localdata?.previewPanelEnabled ?? false).on('update', state$ => this.localdata = {...this.localdata, previewPanelEnabled: state$.value()})
}

export interface LocalSettingsStoreData {
    detailPanelEnabled?: boolean;
    previewPanelEnabled?: boolean;
    columnSizeDelta?: number;
}