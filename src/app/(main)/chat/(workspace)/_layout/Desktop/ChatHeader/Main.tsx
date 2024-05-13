'use client';

import { ActionIcon, Avatar, ChatHeaderTitle } from '@lobehub/ui';
import { Skeleton } from 'antd';
import { useResponsive } from 'antd-style';
import { PanelLeftOpen } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Flexbox } from 'react-layout-kit';

import { DESKTOP_HEADER_ICON_SIZE } from '@/const/layoutTokens';
import { useOpenChatSettings } from '@/hooks/useInterceptingRoutes';
import { useGlobalStore } from '@/store/global';
import { useSessionStore } from '@/store/session';
import { sessionMetaSelectors, sessionSelectors } from '@/store/session/selectors';

import Tags from './Tags';

const Main = memo(() => {
  const { t } = useTranslation('chat');
  const { desktop = true } = useResponsive();
  const [init, isInbox, title, description, avatar, backgroundColor] = useSessionStore((s) => [
    sessionSelectors.isSomeSessionActive(s),
    sessionSelectors.isInboxSession(s),
    sessionMetaSelectors.currentAgentTitle(s),
    sessionMetaSelectors.currentAgentDescription(s),
    sessionMetaSelectors.currentAgentAvatar(s),
    sessionMetaSelectors.currentAgentBackgroundColor(s),
  ]);

  const openChatSettings = useOpenChatSettings();

  const displayTitle = isInbox ? t('inbox.title') : title;
  const displayDesc = isInbox ? t('inbox.desc') : description;
  const [sessionExpandable, updatePreference] = useGlobalStore((s) => [
    s.preference.showSessionPanel,
    s.updatePreference,
  ]);

  return !init ? (
    <Flexbox horizontal>
      <Skeleton
        active
        avatar={{ shape: 'circle', size: 'default' }}
        paragraph={false}
        title={{ style: { margin: 0, marginTop: 8 }, width: 200 }}
      />
    </Flexbox>
  ) : (
    <Flexbox align={'flex-start'} gap={12} horizontal>
      {!desktop && !sessionExpandable && (
        <ActionIcon
          icon={PanelLeftOpen}
          onClick={() => {
            updatePreference({ showSessionPanel: true });
          }}
          size={DESKTOP_HEADER_ICON_SIZE}
          title={t('agentsAndConversations')}
        />
      )}
      <Avatar
        avatar={avatar}
        background={backgroundColor}
        onClick={() => openChatSettings()}
        size={40}
        title={title}
      />
      <ChatHeaderTitle desc={displayDesc} tag={<Tags />} title={displayTitle} />
    </Flexbox>
  );
});

export default Main;
