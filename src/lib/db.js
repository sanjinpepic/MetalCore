import { prisma } from './prisma.js';

export async function fetchAllData() {
    const [steels, knives, glossary, faq, producers] = await Promise.all([
        prisma.steel.findMany({ include: { knives: { select: { id: true, name: true } } } }),
        prisma.knife.findMany({ include: { steels: { select: { id: true, name: true } } } }),
        prisma.glossary.findMany(),
        prisma.fAQ.findMany(),
        prisma.producer.findMany(),
    ]);

    return { steels, knives, glossary, faq, producers };
}

// ========== STEEL CRUD OPERATIONS ==========

export async function createSteel(steelData) {
    const { knives, ...fields } = steelData;

    return prisma.steel.create({
        data: {
            id: fields.id || `custom-${Date.now()}`,
            name: fields.name,
            producer: fields.producer,
            C: fields.C || 0,
            Cr: fields.Cr || 0,
            V: fields.V || 0,
            Mo: fields.Mo || 0,
            W: fields.W || 0,
            Co: fields.Co || 0,
            edge: fields.edge || 5,
            toughness: fields.toughness || 5,
            corrosion: fields.corrosion || 5,
            sharpen: fields.sharpen || 5,
            ht_curve: fields.ht_curve || '',
            desc: fields.desc || '',
            use_case: fields.use_case || '',
            pros: fields.pros || [],
            cons: fields.cons || [],
            pm: fields.pm ?? false,
            parent: fields.parent || [],
            knives: knives?.length ? { connect: knives.map(id => ({ id })) } : undefined,
        },
    });
}

export async function updateSteel(id, steelData) {
    const { knives, ...fields } = steelData;

    return prisma.steel.update({
        where: { id },
        data: {
            name: fields.name,
            producer: fields.producer,
            C: fields.C || 0,
            Cr: fields.Cr || 0,
            V: fields.V || 0,
            Mo: fields.Mo || 0,
            W: fields.W || 0,
            Co: fields.Co || 0,
            edge: fields.edge || 5,
            toughness: fields.toughness || 5,
            corrosion: fields.corrosion || 5,
            sharpen: fields.sharpen || 5,
            ht_curve: fields.ht_curve || '',
            desc: fields.desc || '',
            use_case: fields.use_case || '',
            pros: fields.pros || [],
            cons: fields.cons || [],
            pm: fields.pm ?? false,
            parent: fields.parent || [],
            knives: knives !== undefined ? { set: knives.map(id => ({ id })) } : undefined,
        },
    });
}

export async function deleteSteel(id) {
    await prisma.steel.delete({ where: { id } });
    return { success: true, id };
}

// ========== KNIFE CRUD OPERATIONS ==========

export async function createKnife(knifeData) {
    const { steels, ...fields } = knifeData;

    return prisma.knife.create({
        data: {
            id: fields.id || `custom-knife-${Date.now()}`,
            name: fields.name,
            maker: fields.maker || '',
            category: fields.category || 'EDC',
            description: fields.description || '',
            whySpecial: fields.whySpecial || '',
            image: fields.image || '',
            link: fields.link || '',
            steels: steels?.length ? { connect: steels.map(id => ({ id })) } : undefined,
        },
    });
}

export async function updateKnife(id, knifeData) {
    const { steels, ...fields } = knifeData;

    return prisma.knife.update({
        where: { id },
        data: {
            name: fields.name,
            maker: fields.maker || '',
            category: fields.category || 'EDC',
            description: fields.description || '',
            whySpecial: fields.whySpecial || '',
            image: fields.image || '',
            link: fields.link || '',
            steels: steels !== undefined ? { set: steels.map(id => ({ id })) } : undefined,
        },
    });
}

export async function deleteKnife(id) {
    await prisma.knife.delete({ where: { id } });
    return { success: true, id };
}

// ========== GLOSSARY CRUD OPERATIONS ==========

export async function createGlossary(data) {
    return prisma.glossary.create({
        data: {
            term: data.term,
            def: data.def,
            category: data.category || '',
            level: data.level || '',
        },
    });
}

export async function updateGlossary(id, data) {
    return prisma.glossary.update({
        where: { id: Number(id) },
        data: {
            term: data.term,
            def: data.def,
            category: data.category || '',
            level: data.level || '',
        },
    });
}

export async function deleteGlossary(id) {
    await prisma.glossary.delete({ where: { id: Number(id) } });
    return { success: true, id };
}

// ========== FAQ CRUD OPERATIONS ==========

export async function createFAQ(data) {
    return prisma.fAQ.create({
        data: {
            q: data.q,
            a: data.a,
            category: data.category || '',
        },
    });
}

export async function updateFAQ(id, data) {
    return prisma.fAQ.update({
        where: { id: Number(id) },
        data: {
            q: data.q,
            a: data.a,
            category: data.category || '',
        },
    });
}

export async function deleteFAQ(id) {
    await prisma.fAQ.delete({ where: { id: Number(id) } });
    return { success: true, id };
}

// ========== PRODUCER CRUD OPERATIONS ==========

export async function createProducer(data) {
    return prisma.producer.create({
        data: {
            name: data.name,
            location: data.location,
            coords: data.coords || [],
            region: data.region,
            desc: data.desc,
        },
    });
}

export async function updateProducer(id, data) {
    return prisma.producer.update({
        where: { id: Number(id) },
        data: {
            name: data.name,
            location: data.location,
            coords: data.coords || [],
            region: data.region,
            desc: data.desc,
        },
    });
}

export async function deleteProducer(id) {
    await prisma.producer.delete({ where: { id: Number(id) } });
    return { success: true, id };
}
