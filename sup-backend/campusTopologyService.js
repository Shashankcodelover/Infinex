// =========================================================================
// Infinex — Collegiate Learning & Mentorship Topology Mesh Service
// Manages: Collegiate Hackathon Squads, Skill Corridors, AI Mentorship Links,
// Live Telemetry, Cascading Deletion, and High-Throughput Batch Ingestion (RFC 4180 CSV & JSON).
// =========================================================================

class CampusTopologyService {
    constructor() {
        this.resetTopologyDefaults();
    }

    resetTopologyDefaults() {
        this.squads = [
            {
                id: 'SQUAD-01-QUANTUM',
                name: 'Quantum Leapers',
                institution: 'Indian Institute of Technology, Bombay',
                track: 'Quantum Computing & PQC',
                memberCount: 4,
                readinessIndex: 94.5,
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'SQUAD-02-SENTINEL',
                name: 'AI Sentinel Syndicate',
                institution: 'National Institute of Technology, Surathkal',
                track: 'Autonomous LLM Agents',
                memberCount: 5,
                readinessIndex: 91.2,
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'SQUAD-03-CYBER',
                name: 'ZeroDay Guardians',
                institution: 'BITS Pilani, Pilani Campus',
                track: 'Cyber-Physical SCADA Defense',
                memberCount: 4,
                readinessIndex: 88.7,
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'SQUAD-04-WEB3',
                name: 'Consensus Pioneers',
                institution: 'Delhi Technological University',
                track: 'DeFi & Zero-Knowledge Rollups',
                memberCount: 3,
                readinessIndex: 86.4,
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'SQUAD-05-CLOUD',
                name: 'Distributed Cloud Forge',
                institution: 'IIIT Hyderabad',
                track: 'Edge Microservices & WASM',
                memberCount: 4,
                readinessIndex: 93.0,
                status: 'active',
                createdAt: new Date().toISOString()
            }
        ];

        this.corridors = [
            {
                id: 'CORR-SKILL-101',
                sourceSquadId: 'SQUAD-01-QUANTUM',
                targetDomain: 'Post-Quantum Cryptography & Lattice M-LWE',
                protocol: 'Socratic Peer Coaching',
                coherencePercent: 96.8,
                mentorshipSlaMins: 15,
                velocityScore: 480,
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'CORR-SKILL-102',
                sourceSquadId: 'SQUAD-02-SENTINEL',
                targetDomain: 'Multi-Agent Tool Calling & Cognitive Memory',
                protocol: 'Adaptive Skill Benchmarking',
                coherencePercent: 93.4,
                mentorshipSlaMins: 20,
                velocityScore: 440,
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'CORR-SKILL-103',
                sourceSquadId: 'SQUAD-03-CYBER',
                targetDomain: 'Industrial SCADA Protocol Sandboxing',
                protocol: 'Industry Senior Mentorship',
                coherencePercent: 89.5,
                mentorshipSlaMins: 30,
                velocityScore: 390,
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'CORR-SKILL-104',
                sourceSquadId: 'SQUAD-04-WEB3',
                targetDomain: 'Formal Verification of Smart Contracts',
                protocol: 'Metaverse Virtual Hack',
                coherencePercent: 87.2,
                mentorshipSlaMins: 25,
                velocityScore: 360,
                status: 'active',
                createdAt: new Date().toISOString()
            },
            {
                id: 'CORR-SKILL-105',
                sourceSquadId: 'SQUAD-05-CLOUD',
                targetDomain: 'Raft Consensus & WAL Log Replication',
                protocol: 'Adaptive Skill Benchmarking',
                coherencePercent: 95.1,
                mentorshipSlaMins: 18,
                velocityScore: 470,
                status: 'active',
                createdAt: new Date().toISOString()
            }
        ];
    }

    // Telemetry and Health Metrics
    getTelemetry() {
        const totalCorridors = this.corridors.length;
        const activeCorridors = this.corridors.filter(c => c.status === 'active').length;
        const severedCorridors = this.corridors.filter(c => c.status === 'severed').length;
        const avgCoherence = totalCorridors > 0
            ? Number((this.corridors.reduce((acc, c) => acc + (Number(c.coherencePercent) || 0), 0) / totalCorridors).toFixed(2))
            : 0;
        const totalSquads = this.squads.length;
        const boundSquadIds = new Set(this.corridors.map(c => c.sourceSquadId));
        const campusCoveragePercent = totalSquads > 0
            ? Number(((boundSquadIds.size / totalSquads) * 100).toFixed(1))
            : 0;
        const totalVelocity = this.corridors.reduce((acc, c) => acc + (Number(c.velocityScore) || 0), 0);

        return {
            totalCorridors,
            activeCorridors,
            severedCorridors,
            avgCoherence,
            totalSquads,
            boundSquadsCount: boundSquadIds.size,
            campusCoveragePercent,
            totalVelocity,
            timestamp: new Date().toISOString()
        };
    }

    // Squad Operations
    getAllSquads() {
        return this.squads;
    }

    getSquadById(id) {
        return this.squads.find(s => s.id === id);
    }

    createSquad(data) {
        if (!data || !data.id || !data.name) {
            throw new Error('Squad id and name are required.');
        }
        if (this.squads.some(s => s.id === data.id)) {
            throw new Error(`Squad with ID "${data.id}" already exists.`);
        }
        const squad = {
            id: String(data.id).trim(),
            name: String(data.name).trim(),
            institution: data.institution || 'Collegiate Institute of Technology',
            track: data.track || 'General AI Engineering',
            memberCount: data.memberCount ? Number(data.memberCount) : 4,
            readinessIndex: data.readinessIndex ? Number(data.readinessIndex) : 85.0,
            status: data.status || 'active',
            createdAt: new Date().toISOString()
        };
        this.squads.push(squad);
        return squad;
    }

    deleteSquad(id) {
        const initialSquadCount = this.squads.length;
        this.squads = this.squads.filter(s => s.id !== id);
        if (this.squads.length === initialSquadCount) {
            return { deleted: false, message: `Squad "${id}" not found.` };
        }
        // Cascading deletion: remove all corridors linked to this squad
        const initialCorridorCount = this.corridors.length;
        this.corridors = this.corridors.filter(c => c.sourceSquadId !== id);
        const cascadedCorridors = initialCorridorCount - this.corridors.length;
        return {
            deleted: true,
            squadId: id,
            cascadedCorridorsRemoved: cascadedCorridors,
            message: `Squad ${id} and ${cascadedCorridors} connected learning corridors deleted cleanly.`
        };
    }

    purgeAllSquads() {
        const deletedSquads = this.squads.length;
        const deletedCorridors = this.corridors.length;
        this.squads = [];
        this.corridors = [];
        return {
            deletedSquads,
            deletedCorridors,
            message: `Universal purge executed: all ${deletedSquads} squads and ${deletedCorridors} corridors eliminated.`
        };
    }

    // Corridor Operations
    getAllCorridors() {
        return this.corridors;
    }

    getCorridorById(id) {
        return this.corridors.find(c => c.id === id);
    }

    createCorridor(data) {
        if (!data || !data.sourceSquadId || !data.targetDomain) {
            throw new Error('sourceSquadId and targetDomain are required.');
        }
        const id = data.id || `CORR-SKILL-${Date.now().toString().slice(-4)}`;
        if (this.corridors.some(c => c.id === id)) {
            throw new Error(`Corridor with ID "${id}" already exists.`);
        }
        const corridor = {
            id: String(id).trim(),
            sourceSquadId: String(data.sourceSquadId).trim(),
            targetDomain: String(data.targetDomain).trim(),
            protocol: data.protocol || 'Socratic Peer Coaching',
            coherencePercent: data.coherencePercent !== undefined ? Number(data.coherencePercent) : 92.5,
            mentorshipSlaMins: data.mentorshipSlaMins !== undefined ? Number(data.mentorshipSlaMins) : 20,
            velocityScore: data.velocityScore !== undefined ? Number(data.velocityScore) : 400,
            status: data.status === 'severed' ? 'severed' : 'active',
            createdAt: new Date().toISOString()
        };
        this.corridors.push(corridor);
        return corridor;
    }

    severCorridor(id) {
        const corridor = this.corridors.find(c => c.id === id);
        if (!corridor) throw new Error(`Corridor "${id}" not found.`);
        corridor.status = 'severed';
        corridor.severedAt = new Date().toISOString();
        return corridor;
    }

    restoreCorridor(id) {
        const corridor = this.corridors.find(c => c.id === id);
        if (!corridor) throw new Error(`Corridor "${id}" not found.`);
        corridor.status = 'active';
        delete corridor.severedAt;
        return corridor;
    }

    deleteCorridor(id) {
        const initialCount = this.corridors.length;
        this.corridors = this.corridors.filter(c => c.id !== id);
        return {
            deleted: this.corridors.length < initialCount,
            corridorId: id
        };
    }

    purgeAllCorridors() {
        const deletedCount = this.corridors.length;
        this.corridors = [];
        return {
            deletedCorridors: deletedCount,
            message: `Universal purge executed: ${deletedCount} learning corridors removed.`
        };
    }

    // Batch Ingestion (RFC 4180 CSV & JSON)
    parseRFC4180CSV(rawText) {
        const lines = rawText.split(/\r?\n/).filter(line => line.trim().length > 0);
        if (lines.length === 0) return [];

        function parseLine(line) {
            const row = [];
            let inQuotes = false;
            let token = '';
            for (let i = 0; i < line.length; i++) {
                const ch = line[i];
                if (ch === '"') {
                    if (inQuotes && line[i + 1] === '"') {
                        token += '"';
                        i++;
                    } else {
                        inQuotes = !inQuotes;
                    }
                } else if (ch === ',' && !inQuotes) {
                    row.push(token.trim());
                    token = '';
                } else {
                    token += ch;
                }
            }
            row.push(token.trim());
            return row;
        }

        const headers = parseLine(lines[0]).map(h => h.replace(/^"(.*)"$/, '$1').trim());
        const records = [];
        for (let i = 1; i < lines.length; i++) {
            const values = parseLine(lines[i]);
            if (values.length === headers.length) {
                const obj = {};
                headers.forEach((h, idx) => {
                    obj[h] = values[idx].replace(/^"(.*)"$/, '$1');
                });
                records.push(obj);
            }
        }
        return records;
    }

    ingestCorridorsBatch(payload, format = 'auto') {
        let items = [];
        let isJson = false;

        if (Array.isArray(payload)) {
            items = payload;
            isJson = true;
        } else if (typeof payload === 'string') {
            const trimmed = payload.trim();
            if (format === 'json' || (format === 'auto' && (trimmed.startsWith('[') || trimmed.startsWith('{')))) {
                try {
                    const parsed = JSON.parse(trimmed);
                    items = Array.isArray(parsed) ? parsed : [parsed];
                    isJson = true;
                } catch (e) {
                    throw new Error(`Invalid JSON batch format: ${e.message}`);
                }
            } else {
                items = this.parseRFC4180CSV(trimmed);
            }
        } else {
            throw new Error('Invalid payload: expected CSV string or JSON array.');
        }

        if (items.length === 0) {
            throw new Error('Batch payload contained 0 valid rows.');
        }

        const ingested = [];
        const errors = [];

        items.forEach((item, index) => {
            try {
                if (!item.sourceSquadId || !item.targetDomain) {
                    throw new Error(`Row ${index + 1}: Missing sourceSquadId or targetDomain`);
                }
                const created = this.createCorridor(item);
                ingested.push(created);
            } catch (err) {
                errors.push({ row: index + 1, error: err.message });
            }
        });

        return {
            success: true,
            totalProcessed: items.length,
            ingestedCount: ingested.length,
            errorCount: errors.length,
            ingested,
            errors,
            format: isJson ? 'JSON' : 'RFC4180_CSV'
        };
    }

    ingestSquadsBatch(payload, format = 'auto') {
        let items = [];
        let isJson = false;

        if (Array.isArray(payload)) {
            items = payload;
            isJson = true;
        } else if (typeof payload === 'string') {
            const trimmed = payload.trim();
            if (format === 'json' || (format === 'auto' && (trimmed.startsWith('[') || trimmed.startsWith('{')))) {
                try {
                    const parsed = JSON.parse(trimmed);
                    items = Array.isArray(parsed) ? parsed : [parsed];
                    isJson = true;
                } catch (e) {
                    throw new Error(`Invalid JSON batch format: ${e.message}`);
                }
            } else {
                items = this.parseRFC4180CSV(trimmed);
            }
        } else {
            throw new Error('Invalid payload: expected CSV string or JSON array.');
        }

        if (items.length === 0) {
            throw new Error('Batch payload contained 0 valid rows.');
        }

        const ingested = [];
        const errors = [];

        items.forEach((item, index) => {
            try {
                if (!item.id || !item.name) {
                    throw new Error(`Row ${index + 1}: Missing id or name`);
                }
                const created = this.createSquad(item);
                ingested.push(created);
            } catch (err) {
                errors.push({ row: index + 1, error: err.message });
            }
        });

        return {
            success: true,
            totalProcessed: items.length,
            ingestedCount: ingested.length,
            errorCount: errors.length,
            ingested,
            errors,
            format: isJson ? 'JSON' : 'RFC4180_CSV'
        };
    }
}

module.exports = new CampusTopologyService();
