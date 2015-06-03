# -*- coding: utf-8 -*-

import datetime
import re

from ipalib import _
from ipalib import errors, output
from ipalib.parameters import Int
from ipalib.plugable import Registry
from ipalib.plugins import dns
from ipalib.plugins.baseldap import (
        LDAPQuery,
        pkey_to_value,
        add_missing_object_class,
    )
from ipalib.plugins.internal import i18n_messages

from ipapython.dn import DN


dns.ForwardRecord.extra += (
    Int('dnsttl?',
        label=_('Time to live'),
        doc=_('Time to live for records at zone apex'),
        default=38599, # TODO: 38600
        minvalue=0,
        maxvalue=2147483647, # see RFC 2181
    ),)

register = Registry()

def dnsrecord_precallback(self, ldap, dn, entry, attrs_list, *keys, **options):
    if 'dnsttl' not in attrs_list:
        attrs_list.append('dnsttl')
    if 'dnsttl' not in entry:
        zone = dn.rdns[1]['idnsname']
        zdn = DN(dn)
        del zdn.rdns[0]
        z = ldap.get_entry(zdn, ['idnsSOAexpire', 'idnsSOAretry',
                                 'idnsSOAminimum', 'idnsSOArefresh', 'dNSTTL'])
        ttl = z.get('dNSTTL', None)
        if not ttl:  # None or []
            expire = int(z['idnsSOAexpire'][0])
            retry = int(z['idnsSOAretry'][0])
            #minimum = int(z['idnsSOAminimum'][0])
            refresh = int(z['idnsSOArefresh'][0])
            ttl = expire if expire < retry else retry
            ttl = [ttl if ttl < refresh else refresh]
        entry['dnsttl'] = ttl
    return dn

dns.dnsrecord_add.register_pre_callback(dnsrecord_precallback)
dns.dnsrecord_mod.register_pre_callback(dnsrecord_precallback)

