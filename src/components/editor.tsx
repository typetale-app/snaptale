import React, { useState } from 'react';
import FilerobotImageEditor, {
    TABS,
    TOOLS,
} from 'react-filerobot-image-editor';

export function Editor() {

    const [isImgEditorShown, setIsImgEditorShown] = useState(false);

    const openImgEditor = () => {
        setIsImgEditorShown(true);
    };

    const closeImgEditor = () => {
        setIsImgEditorShown(false);
    };

    return (


        <FilerobotImageEditor
            source="https://images.unsplash.com/photo-1778400599089-af77d9a2c916?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            onSave={(editedImageObject, designState) => console.log('saved', editedImageObject, designState)}
            onClose={closeImgEditor}
            annotationsCommon={{
                fill: '#ff0000',
            }}
            Text={{ text: 'Filerobot...' }}
            Rotate={{ angle: 90, componentType: 'slider' }}
            Crop={{
                presetsItems: [
                    {
                        titleKey: 'classicTv',
                        descriptionKey: '4:3',
                        ratio: 4 / 3,
                        // icon: CropClassicTv, // optional, CropClassicTv is a React Function component. Possible (React Function component, string or HTML Element)
                    },
                    {
                        titleKey: 'cinemascope',
                        descriptionKey: '21:9',
                        ratio: 21 / 9,
                        // icon: CropCinemaScope, // optional, CropCinemaScope is a React Function component.  Possible (React Function component, string or HTML Element)
                    },
                ],
                presetsFolders: [
                    {
                        titleKey: 'socialMedia', // will be translated into Social Media as backend contains this translation key

                        // icon: Social, // optional, Social is a React Function component. Possible (React Function component, string or HTML Element)
                        groups: [
                            {
                                titleKey: 'facebook',
                                items: [
                                    {
                                        titleKey: 'profile',
                                        width: 180,
                                        height: 180,
                                        descriptionKey: 'fbProfileSize',
                                    },
                                    {
                                        titleKey: 'coverPhoto',
                                        width: 820,
                                        height: 312,
                                        descriptionKey: 'fbCoverPhotoSize',
                                    },
                                ],
                            },
                        ],
                    },
                ],
            }}
            tabsIds={[TABS.ADJUST, TABS.ANNOTATE, TABS.WATERMARK]} // or {['Adjust', 'Annotate', 'Watermark']}
            defaultTabId={TABS.ANNOTATE} // or 'Annotate'
            defaultToolId={TOOLS.TEXT} // or 'Text'
            savingPixelRatio={0} previewPixelRatio={0} />
    );
}