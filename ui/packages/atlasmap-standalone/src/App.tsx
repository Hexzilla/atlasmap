/*
    Copyright (C) 2017 Red Hat, Inc.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
import { Brand, Page, PageHeader, PageSection } from '@patternfly/react-core';

import { Atlasmap } from '@atlasmap/atlasmap';
import React, { useState } from 'react';
import atlasmapLogo from './logo-horizontal-darkbg.png';

const App: React.FC = () => {
  const [fileContent, setFileContent] = useState<Blob | null>(null);

  window.addEventListener('message', (event) => {
    console.log(event);
    console.log('Message from parent:', event.data);

    if (event.origin === 'http://localhost:5173' && event.data.fileData) {
      const newFileContent = new Blob([event.data.fileData]);
      setFileContent(newFileContent);
    }
  
    // Optionally, send a message back to the parent
    // if (event.source && event.origin) {
    //   (event.source as WindowProxy).postMessage('Hello from iframe', event.origin);
    // }
  });

  const exportADMArchiveFile = (fileContent: Blob) => {
    console.log("Export Clicked! --- IFrame");

    window.parent.postMessage(fileContent, '*');
  }

  return (
    <Page
      header={
        <PageHeader
          logo={
            <>
              <Brand
                src={atlasmapLogo}
                alt="AtlasMap Data Mapper UI"
                height="40"
              />
            </>
          }
          style={{ minHeight: 40 }}
        />
      }
    >
      <PageSection
        variant={'light'}
        padding={{ default: 'noPadding' }}
        isFilled={true}
      >
        <Atlasmap 
          admFile={fileContent}
          exportADMArchiveFileOnMain={exportADMArchiveFile}
        />
      </PageSection>
    </Page>
  );
};

export default App;
