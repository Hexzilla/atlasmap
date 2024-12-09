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
import React from 'react';
import atlasmapLogo from './logo-horizontal-darkbg.png';

const App: React.FC = () => {

  window.addEventListener('message', (event) => {
    console.log(event);
    // if (event.origin !== 'http://localhost:3000') return; // Ensure the origin is correct
    console.log('Message from parent:', event.data);
  
    // Optionally, send a message back to the parent
    if (event.source && event.origin) {
      (event.source as WindowProxy).postMessage('Hello from iframe', event.origin);
    }
  });

  const exportADMArchiveFile = (fileContent: Blob) => {
    console.log("Export Clicked!");

    const url = 'http://172.16.153.1/dashboard/upload.php';
    fetch(url, {
      method: 'PUT',
      body: fileContent,
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then(_ => {
      console.log('File successfully saved to URL:', url);
    })
    .catch(error => {
      console.log(error);
    });
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
          admFilePath={"http://172.16.153.1/dashboard/atlasmap-mapping-mine.adm"}
          exportADMArchiveFileOnMain={exportADMArchiveFile}
        />
      </PageSection>
    </Page>
  );
};

export default App;
