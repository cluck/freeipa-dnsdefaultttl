define([
    'freeipa/phases',
    'freeipa/reg',
    'freeipa/rpc',
    'freeipa/ipa',
    'freeipa/dns'],
    function(phases, reg, rpc, IPA, dns) {

function get_item_by_attrval(array, attr, value) {
    for (var i=0, l=array.length; i<l; i++) {
        if (array[i][attr] === value) return array[i];
    }
    return null;
}

var exp = IPA.dnsdefaultttl = {};

exp.on_registration = function() {

    /* Add TTL fields to details page */
    details_facet = get_item_by_attrval(
        IPA.dns.record_spec.facets, '$type', 'details');
    details_facet.fields.push({
        name: 'dnsttl',
        $type: 'singlevalued',
        label: 'Time to live',
        widget: 'identity.dnsttl'
    });
    identity_widget = get_item_by_attrval(
        details_facet.widgets, 'name', 'identity');
    identity_widget.widgets.push({
        type: 'text',
        name: 'dnsttl'
    });

    /*
     * Field does not appear in saved object: why?
     */
    /*
    IPA.dns.record_spec.adder_dialog.fields.push({
        name: 'dnsttl',
        $type: 'singlevalued',
        label: 'Time to live',
        widget: 'general.dnsttl'
    });
    general_widgets = get_item_by_attrval(
        IPA.dns.record_spec.adder_dialog.widgets, 'name', 'general');
    general_widgets.widgets.push({
        type: 'text',
        name: 'dnsttl'
    });

    exp.get_orig_record_metadata = IPA.dns.get_record_metadata;
    IPA.dns.get_record_metadata = exp.get_record_metadata;
    */
}

/* Currently unused */
exp.get_record_metadata = function() {
    exp.get_orig_record_metadata();
    record_metadata = IPA.dns.record_metadata;
    /* add TTL to all record types */
    for (var i=0; i<record_metadata.length; i++) {
        type = record_metadata[i];
        console.debug(type.name);
        type.attributes.push({
            name: 'dnsttl',
            $type: 'text',
            label: 'Time to live attr',
            validators: [],
            //required: true
            widget_opt: {
                default_value: '3600'
            }
        });
        type.adder_attributes.push('dnsttl');
        //record_metadata[i].columns.push('dnsttl');
    }
    console.debug('SSSSSSSSS step 2');
    IPA.dns.record_metadata = record_metadata;
    return IPA.dns.record_metadata;
}

phases.on('registration', exp.on_registration, 10);

return exp;
}); 

