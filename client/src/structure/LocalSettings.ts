export class LocalSettings {
    static get previewPanelEnabled() { return this.localdata?.previewPanelEnabled }
    static set previewPanelEnabled(boolean: boolean | undefined) { this.localdata = {...this.localdata, previewPanelEnabled: boolean }}
    
    static get detailPanelEnabled() { return this.localdata?.detailPanelEnabled }
    static set detailPanelEnabled(boolean: boolean | undefined) { this.localdata = {...this.localdata, detailPanelEnabled: boolean }}

    static previewPanelEnable$ = $.state(this.previewPanelEnabled ?? false).on('update', (state$) => LocalSettings.previewPanelEnabled = state$.value)
    static detailPanelEnable$ = $.state(this.detailPanelEnabled ?? true).on('update', (state$) => LocalSettings.detailPanelEnabled = state$.value)
    
    static get localdata() { const data = localStorage.getItem('local_settings_data'); return data ? JSON.parse(data) as LocalSettingsStoreData : null }
    static set localdata(data: LocalSettingsStoreData | null) { localStorage.setItem('local_settings_data', JSON.stringify(data)) }

    static columnSize$ = $.state(this.localdata?.columnSizeDelta ?? 0).on('update', state$ => this.localdata = {...this.localdata, columnSizeDelta: state$.value})
}

export interface LocalSettingsStoreData {
    detailPanelEnabled?: boolean;
    previewPanelEnabled?: boolean;
    columnSizeDelta?: number;
}