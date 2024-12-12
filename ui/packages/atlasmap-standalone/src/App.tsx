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

/*async function readBinaryFile(file: File,reader: FileReader): Promise<Int8Array> {
  return new Promise<Int8Array>((resolve) => {
    reader.onload = () => {
      const fileBody = new Int8Array(reader.result as ArrayBuffer);
      resolve(fileBody);
    };
    reader.readAsArrayBuffer(file);
  });
}

const uint8Array = new Uint8Array([65, 66, 67, 68]); // ABCD in ASCII
const fileContent: Blob = new Blob([uint8Array], {
  type: 'application/octet-stream',
});
const file = new File([fileContent], "atlasmap.adm");

const reader = new FileReader();
readBinaryFile(file, reader).then(buffer => {
  console.log('~~~~~~~~~~~~~~~~~~buffer', buffer);
});*/

const App: React.FC = () => {
  // const { importADMArchiveFile } = useAtlasmap();
  return (
    <Page>
      <PageSection
        variant={'light'}
        padding={{ default: 'noPadding' }}
        isFilled={true}
      >
        <Atlasmap
          allowImport={false}
          allowExport={false}
          allowReset={false}
          allowDelete={false}
          allowCustomJavaClasses={false}
        />
      </PageSection>
    </Page>
  );
};

export default App;
