const visitorInvitations = [];
const visitorInvitationsStorageKey = 'condomus-visitor-invitations';
const packages = [];
const residents = [
  {
    id: 'resident-001',
    name: 'Maria da Silva',
    apartment: '302',
    address: 'Rua das Flores, 120',
    block: 'A'
  },
  {
    id: 'resident-002',
    name: 'João da Silva',
    apartment: '101',
    address: 'Rua das Flores, 120',
    block: 'A'
  },
  {
    id: 'resident-003',
    name: 'Ana Oliveira',
    apartment: '204',
    address: 'Rua das Flores, 120',
    block: 'B'
  },
  {
    id: 'resident-004',
    name: 'Samara Lima',
    apartment: '77',
    address: 'Avenida Napoleão Viana, 1200',
    block: 'Residencial Milano 1'
  }
];
const mockResidentWhatsapp = '5582996883163';
const mockUsers = [
  {
    email: 'morador@condomus.com',
    password: '123456',
    personId: 'person-001',
    displayName: 'Morador Condomus',
    associations: [
      {
        accountId: 'account-001',
        tenantId: 'tenant-residencial-milano-1',
        accountStatus: 'active'
      }
    ]
  },
  {
    email: 'inativo@condomus.com',
    password: '123456',
    personId: 'person-002',
    displayName: 'Conta Inativa',
    associations: [
      {
        accountId: 'account-002',
        tenantId: 'tenant-residencial-milano-1',
        accountStatus: 'inactive'
      }
    ]
  }
];
const authSessions = new Map();
const authTokenExpirationMs = 60 * 60 * 1000;

const getBearerToken = (request) => {
  const authorization = request?.headers?.Authorization ||
    request?.headers?.authorization || '';
  return authorization.startsWith('Bearer ')
    ? authorization.slice('Bearer '.length)
    : '';
};

const syncVisitorInvitations = () => {
  if (typeof globalThis.localStorage === 'undefined') {
    return;
  }

  const storedInvitations = globalThis.localStorage.getItem(
    visitorInvitationsStorageKey
  );

  if (!storedInvitations) {
    return;
  }

  try {
    const parsedInvitations = JSON.parse(storedInvitations);

    if (Array.isArray(parsedInvitations)) {
      visitorInvitations.splice(0, visitorInvitations.length, ...parsedInvitations);
    }
  } catch (error) {
    if (error instanceof SyntaxError) {
      globalThis.localStorage.removeItem(visitorInvitationsStorageKey);
      return;
    }

    throw error;
  }
};

const persistVisitorInvitations = () => {
  if (typeof globalThis.localStorage !== 'undefined') {
    globalThis.localStorage.setItem(
      visitorInvitationsStorageKey,
      JSON.stringify(visitorInvitations)
    );
  }
};

const getPublicOrigin = (request) => {
  const requestOrigin = request?.headers?.origin;
  const origin = requestOrigin || globalThis.location?.origin;
  const hostname = requestOrigin
    ? new URL(requestOrigin).hostname
    : globalThis.location?.hostname;

  if (hostname && /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)) {
    const nipHostname = `${hostname}.nip.io`;
    const url = requestOrigin ? new URL(requestOrigin) : globalThis.location;
    const port = url?.port ? `:${url.port}` : '';
    return `${url?.protocol || 'http:'}//${nipHostname}${port}`;
  }

  return origin || 'http://localhost:3000';
};

const getVisitorType = (visitorType) => ({
  Convidado: 'visitor',
  Prestador: 'service',
  Delivery: 'delivery'
}[visitorType] || 'visitor');

const getInvitationSchedule = (invitation) => ({
  id: invitation.id,
  name: invitation.visitorName,
  apartment: invitation.apartment,
  block: invitation.block,
  time: new Date(invitation.expiresAt).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  }),
  day: 'Hoje',
  type: getVisitorType(invitation.visitorType),
  accessStatus: invitation.status === 'pending' &&
    invitation.authorizationMode === 'preauthorized'
    ? 'preauthorized'
    : invitation.status
});

export const mocks = {
  '/v1/auth/login': async (request) => {
    const credentials = request.body || {};
    const user = mockUsers.find(
      (item) => item.email === credentials.email &&
        item.password === credentials.password
    );

    if (!user) {
      return {
        success: false,
        data: null
      };
    }

    const association = user.associations[0];
    const accessToken = `mock-token-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const expiresAt = Date.now() + authTokenExpirationMs;

    authSessions.set(accessToken, {
      ...user,
      ...association,
      accessToken,
      expiresAt
    });

    return {
      success: true,
      data: {
        accessToken,
        tokenType: 'Bearer',
        expiresIn: authTokenExpirationMs / 1000,
        expiresAt: new Date(expiresAt).toISOString(),
        personId: user.personId,
        accountId: association.accountId,
        tenantId: association.tenantId
      }
    };
  },

  '/v1/auth/authorize': async (request) => {
    const token = getBearerToken(request);
    const session = authSessions.get(token);
    const requested = request.body || {};

    if (!session || session.expiresAt <= Date.now()) {
      authSessions.delete(token);
      return {
        success: false,
        data: null
      };
    }

    const associationMatches = session.personId === requested.personId &&
      session.accountId === requested.accountId &&
      session.tenantId === requested.tenantId;

    if (!associationMatches || session.accountStatus !== 'active') {
      return {
        success: false,
        data: {
          authorized: false,
          accessToken: token,
          personId: session.personId,
          accountId: session.accountId,
          tenantId: session.tenantId,
          accountStatus: session.accountStatus,
          displayName: session.displayName
        }
      };
    }

    return {
      success: true,
      data: {
        authorized: true,
        accessToken: token,
        personId: session.personId,
        accountId: session.accountId,
        tenantId: session.tenantId,
        accountStatus: session.accountStatus,
        displayName: session.displayName
      }
    };
  },

  '/visitors-count': async () => 42,

  '/v1/accounts': async () => {
    syncVisitorInvitations();

    return {
    success: true,
    data: visitorInvitations
    .map(getInvitationSchedule)
    .reverse()
    .concat([{
    id: '1',
    name: 'Entrega Uber Eats',
    apartment: '101',
    block: 'A',
    time: '14:00',
    day: 'Hoje',
    type: 'visitor',
    accessStatus: 'pending'
  },
  {
    id: '2',
    name: 'Amazon Hub',
    apartment: '101',
    block: 'A',
    time: '16:00',
    day: 'Hoje',
    type: 'delivery',
    accessStatus: 'pending'
  },
  {
    id: '3',
    name: 'Manutenção',
    apartment: '101',
    block: 'A',
    time: '10:00',
    day: 'Hoje',
    type: 'service',
    accessStatus: 'pending'
  }])
    };
  },

  '/v1/visitor-invitations': async (request) => {
    syncVisitorInvitations();
    const data = request.body;
    const createdAt = new Date();
    const qrCodeToken = `condomus-invitation-${Date.now()}`;
    const invitation = {
      id: `invitation-${Date.now()}`,
      visitorName: data.visitorName,
      visitorType: data.visitorType,
      additionalInfo: data.additionalInfo,
      authorizationMode: data.authorizationMode || 'arrival',
      apartment: '101',
      block: 'A',
      createdAt: createdAt.toISOString(),
      expiresAt: new Date(createdAt.getTime() + 86400000).toISOString(),
      status: 'pending',
      qrCodeToken,
      publicUrl: `${getPublicOrigin(request)}/visitor-access?token=${qrCodeToken}`
    };

    visitorInvitations.push(invitation);
    persistVisitorInvitations();

    return {
      success: true,
      data: invitation
    };
  },

  '/v1/packages': async (request) => {
    if (request.method === 'GET') {
      return {
        success: true,
        data: packages
      };
    }

    const data = request.body;
    const packageRecord = {
      id: `package-${Date.now()}`,
      residentId: data.residentId || null,
      recipientName: data.recipientName,
      apartment: data.apartment,
      address: data.address || '',
      carrier: data.carrier || 'Não informada',
      trackingCode: data.trackingCode,
      status: 'notified',
      receivedAt: new Date().toISOString(),
      photoUrl: data.photoUrl
    };

    packages.unshift(packageRecord);

    return {
      success: true,
      data: packageRecord
    };
  },

  '/v1/residents': async () => ({
    success: true,
    data: residents
  }),

  '/v1/visitor-invitations/revoke': async (request) => {
    syncVisitorInvitations();
    const invitation = visitorInvitations.find(
      (item) => item.id === request.body.invitationId
    );

    if (invitation && invitation.status === 'pending') {
      invitation.status = 'revoked';
      persistVisitorInvitations();
    }

    return {
      success: true,
      data: invitation
    };
  },

  '/v1/visitor-invitations/validate': async (request) => {
    syncVisitorInvitations();
    const invitation = visitorInvitations.find(
      (item) => item.qrCodeToken === request.body.token
    );

    if (
      invitation &&
      invitation.status === 'pending' &&
      new Date(invitation.expiresAt).getTime() <= Date.now()
    ) {
      invitation.status = 'expired';
      persistVisitorInvitations();
    }

    if (!invitation || invitation.status !== 'pending') {
      const message = !invitation
        ? 'Convite não encontrado.'
        : invitation.status === 'expired'
          ? 'Convite expirado.'
          : invitation.status === 'revoked'
            ? 'Convite revogado.'
            : invitation.status === 'denied'
              ? 'Entrada recusada pelo morador.'
            : 'Convite já utilizado.';

      return {
        success: true,
        data: {
          valid: false,
          message,
          invitation: invitation || null,
          synchronized: true
        }
      };
    }

    const validatedAt = request.body.validatedAt || new Date().toISOString();

    if (
      invitation.authorizationMode === 'arrival' &&
      !invitation.residentAuthorized
    ) {
      invitation.status = 'awaiting_confirmation';
      invitation.arrivalRequestedAt = validatedAt;
      persistVisitorInvitations();

      const whatsappMessage = [
        '🏠 *Confirmação de entrada - Condomus*',
        '',
        'Olá, morador!',
        `O visitante ${invitation.visitorName} chegou à portaria.`,
        '',
        `Nome: ${invitation.visitorName}`,
        `Tipo: ${invitation.visitorType}`,
        invitation.additionalInfo
          ? `Observação: ${invitation.additionalInfo}`
          : null,
        `Apartamento: ${invitation.apartment}${invitation.block ? ` · Bloco ${invitation.block}` : ''}`,
        '',
        'Acesse o Condomus para confirmar ou recusar a entrada.',
      ].filter(Boolean).join('\n');

      return {
        success: true,
        data: {
          valid: false,
          message: 'Aguardando confirmação do morador.',
          invitation,
          synchronized: true,
          requiresResidentConfirmation: true,
          residentWhatsappUrl: `https://wa.me/${mockResidentWhatsapp}?text=${encodeURIComponent(whatsappMessage)}`
        }
      };
    }

    invitation.status = 'validated';
    persistVisitorInvitations();
    persistVisitorInvitations();

    const whatsappMessage = [
      '🏠 *Atualização Condomus*',
      '',
      'Olá, morador!',
      `O visitante ${invitation.visitorName} chegou à portaria.`,
      '',
      '👤 *Dados do visitante*',
      `Nome: ${invitation.visitorName}`,
      `Tipo: ${invitation.visitorType}`,
      invitation.additionalInfo
        ? `Observação: ${invitation.additionalInfo}`
        : null,
      '',
      '📍 *Acesso*',
      `Apartamento: ${invitation.apartment}${invitation.block ? ` · Bloco ${invitation.block}` : ''}`,
      `⏰ Validado em: ${new Date(validatedAt).toLocaleString('pt-BR')}`,
      '✅ Acesso já autorizado pelo morador. Entrada confirmada na portaria.'
    ].filter(Boolean);
    const formattedWhatsappMessage = whatsappMessage.join('\n');

    return {
      success: true,
      data: {
        valid: true,
        message: 'Acesso autorizado pelo morador. Entrada validada.',
        invitation,
        synchronized: true,
        residentWhatsappUrl: `https://wa.me/${mockResidentWhatsapp}?text=${encodeURIComponent(formattedWhatsappMessage)}`
      }
    };
  },

  '/v1/visitor-invitations/authorize': async (request) => {
    syncVisitorInvitations();
    const invitation = visitorInvitations.find(
      (item) => item.id === request.body.invitationId
    );

    if (
      !invitation ||
      invitation.status !== 'awaiting_confirmation'
    ) {
      return {
        success: false,
        data: invitation || null
      };
    }

    invitation.status = request.body.authorized ? 'pending' : 'denied';
    invitation.residentAuthorized = request.body.authorized;
    invitation.authorizedAt = new Date().toISOString();
    persistVisitorInvitations();

    return {
      success: true,
      data: invitation
    };
  },

  '/v1/visitor-invitations/pending-authorizations': async () => {
    syncVisitorInvitations();

    return {
      success: true,
      data: visitorInvitations.filter(
        (invitation) => invitation.status === 'awaiting_confirmation'
      )
    };
  },

  '/v1/visitor-invitations/sync': async () => ({
    success: true,
    data: {
      synchronizedIds: [],
      rejectedIds: []
    }
  }),

  '/v1/visitor-invitations/public': async (request) => {
    syncVisitorInvitations();
    const invitation = visitorInvitations.find(
      (item) => item.qrCodeToken === request.body.token
    );

    return {
      success: Boolean(invitation),
      data: invitation ? {
        visitorName: invitation.visitorName,
        visitorType: invitation.visitorType,
        expiresAt: invitation.expiresAt,
        status: invitation.status
      } : null
    };
  },
};
