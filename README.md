# Editable and configurable TTL DNS values for FreeIPA

This is a FreeIPA 4 plugin to handle custom DNS TTL values on DNS records.

Be warned that it does it improperly, it is a workaround until the FreeIPA
folks properly fix https://fedorahosted.org/bind-dyndb-ldap/ticket/70.

This plugin propagates the TTL configured on the zone (SOA record) to all
records created and modified. When no TTL is set explicitely, it falls back on
a value choosen between the SOA expire, refresh and timeout values.

## Installation

Download the code somewhere, then run

    python setup.py install

Then, to make FreeIPA web clients realize that there is additional JavaScript
to be loaded, run:

    tools/reload_plugins.sh

