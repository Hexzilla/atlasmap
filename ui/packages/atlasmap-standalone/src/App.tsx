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
import { Page, PageSection } from '@patternfly/react-core';

import { Atlasmap, useAtlasmap } from '@atlasmap/atlasmap';
import React, { useCallback, useEffect, useState } from 'react';

const App: React.FC = () => {
  const {
    configModel,
    pending,
    sources,
    importADMArchiveFile,
    importInstanceSchema,
  } = useAtlasmap();
  const isLoading = pending || !configModel?.initCfg?.initialized;

  const [admArchive, setAdmArchive] = useState<Uint8Array | null>();
  const [sourceDocument, setSourceDocument] = useState<string>();

  useEffect(() => {
    const handleMessage = (event: { data: any }) => {
      if (event.data) {
        const data = JSON.parse(event.data);
        if (data.adm) {
          setAdmArchive(new Uint8Array(data.adm));
        } else if (data.source) {
          data.source && setSourceDocument(JSON.stringify(data.source));
        }
      }
    };
    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  useEffect(() => {
    if (!isLoading && admArchive) {
      const fileContent: Blob = new Blob([admArchive], {
        type: 'application/octet-stream',
      });
      const file = new File([fileContent], 'atlasmap.adm');
      importADMArchiveFile(file);
      setAdmArchive(null);
    }
  }, [isLoading, admArchive, importADMArchiveFile]);

  const importSourceDocument = useCallback(() => {
    if (sourceDocument) {
      const uint8Array = new TextEncoder().encode(sourceDocument);
      const fileContent: Blob = new Blob([uint8Array], {
        type: 'application/octet-stream',
      });
      const file = new File([fileContent], 'Source.json');
      importInstanceSchema(file, configModel, true, false);
    }
  }, [configModel, sourceDocument, importInstanceSchema]);

  useEffect(() => {
    if (!isLoading && !sources.length) {
      importSourceDocument();
    }
  }, [isLoading, sources, importSourceDocument]);

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
          allowReset={true}
          allowDelete={false}
          allowCustomJavaClasses={false}
        />
      </PageSection>
    </Page>
  );
};

export default App;
