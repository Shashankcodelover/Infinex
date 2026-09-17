const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert');
const campusTopology = require('../campusTopologyService');

describe('Infinex Enterprise Collegiate Relational Topology & Batch Ingestion Suite', () => {
    beforeEach(() => {
        campusTopology.resetTopologyDefaults();
    });

    it('1. should seed default collegiate squads and verify schema integrity', () => {
        const squads = campusTopology.getAllSquads();
        assert.ok(Array.isArray(squads));
        assert.strictEqual(squads.length, 5);
        const quantum = campusTopology.getSquadById('SQUAD-01-QUANTUM');
        assert.ok(quantum);
        assert.strictEqual(quantum.track, 'Quantum Computing & PQC');
        assert.strictEqual(quantum.memberCount, 4);
    });

    it('2. should calculate live telemetry with campus coverage and coherence metrics', () => {
        const telemetry = campusTopology.getTelemetry();
        assert.strictEqual(telemetry.totalSquads, 5);
        assert.strictEqual(telemetry.totalCorridors, 5);
        assert.strictEqual(telemetry.activeCorridors, 5);
        assert.strictEqual(telemetry.severedCorridors, 0);
        assert.ok(telemetry.avgCoherence > 90);
        assert.strictEqual(telemetry.campusCoveragePercent, 100);
    });

    it('3. should provision a new collegiate learning corridor and bind domain', () => {
        const corridor = campusTopology.createCorridor({
            id: 'CORR-TEST-99',
            sourceSquadId: 'SQUAD-03-CYBER',
            targetDomain: 'Threat Hunting & Memory Forensics',
            protocol: 'Socratic Peer Coaching',
            coherencePercent: 97.5,
            mentorshipSlaMins: 15,
            velocityScore: 500
        });
        assert.strictEqual(corridor.id, 'CORR-TEST-99');
        assert.strictEqual(corridor.status, 'active');
        const telemetry = campusTopology.getTelemetry();
        assert.strictEqual(telemetry.totalCorridors, 6);
    });

    it('4. should sever a learning corridor with 1-click control and recalculate metrics', () => {
        const severed = campusTopology.severCorridor('CORR-SKILL-101');
        assert.strictEqual(severed.status, 'severed');
        assert.ok(severed.severedAt);

        const telemetry = campusTopology.getTelemetry();
        assert.strictEqual(telemetry.severedCorridors, 1);
        assert.strictEqual(telemetry.activeCorridors, 4);

        const restored = campusTopology.restoreCorridor('CORR-SKILL-101');
        assert.strictEqual(restored.status, 'active');
        assert.strictEqual(campusTopology.getTelemetry().severedCorridors, 0);
    });

    it('5. should delete single learning corridor and verify referential continuity', () => {
        const result = campusTopology.deleteCorridor('CORR-SKILL-102');
        assert.strictEqual(result.deleted, true);
        assert.strictEqual(campusTopology.getAllCorridors().length, 4);
    });

    it('6. should execute cascading deletion when a squad is removed', () => {
        // SQUAD-01-QUANTUM is source for CORR-SKILL-101
        const result = campusTopology.deleteSquad('SQUAD-01-QUANTUM');
        assert.strictEqual(result.deleted, true);
        assert.strictEqual(result.cascadedCorridorsRemoved, 1);
        assert.strictEqual(campusTopology.getAllSquads().length, 4);
        assert.strictEqual(campusTopology.getAllCorridors().length, 4);
    });

    it('7. should ingest learning corridors batch via RFC 4180 CSV format', () => {
        const csvData = `id,sourceSquadId,targetDomain,protocol,coherencePercent,mentorshipSlaMins,velocityScore
CORR-BATCH-01,SQUAD-02-SENTINEL,"Computer Vision & Object Detection","Adaptive Skill Benchmarking",94.5,20,460
CORR-BATCH-02,SQUAD-05-CLOUD,"Kubernetes Operator Architecture","Socratic Peer Coaching",96.0,15,490`;

        const batch = campusTopology.ingestCorridorsBatch(csvData, 'csv');
        assert.strictEqual(batch.success, true);
        assert.strictEqual(batch.ingestedCount, 2);
        assert.strictEqual(batch.errorCount, 0);
        assert.strictEqual(campusTopology.getAllCorridors().length, 7);
    });

    it('8. should ingest collegiate squads batch via structured JSON format', () => {
        const jsonData = JSON.stringify([
            {
                id: 'SQUAD-06-ROBOTICS',
                name: 'Kinetic Automata Lab',
                institution: 'PSG College of Technology',
                track: 'ROS2 & Embedded Control',
                memberCount: 5,
                readinessIndex: 89.2
            },
            {
                id: 'SQUAD-07-NEURO',
                name: 'Synapse Brain Interface',
                institution: 'Manipal Institute of Technology',
                track: 'BCI & Neural Decoding',
                memberCount: 4,
                readinessIndex: 92.4
            }
        ]);

        const batch = campusTopology.ingestSquadsBatch(jsonData, 'json');
        assert.strictEqual(batch.success, true);
        assert.strictEqual(batch.ingestedCount, 2);
        assert.strictEqual(campusTopology.getAllSquads().length, 7);
    });

    it('9. should safely reject malformed batch payloads with error feedback', () => {
        assert.throws(() => {
            campusTopology.ingestCorridorsBatch('broken,unformatted\n');
        });
    });

    it('10. should execute universal corridor purge and verify zero count', () => {
        const purgeResult = campusTopology.purgeAllCorridors();
        assert.strictEqual(purgeResult.deletedCorridors, 5);
        assert.strictEqual(campusTopology.getAllCorridors().length, 0);
        const telemetry = campusTopology.getTelemetry();
        assert.strictEqual(telemetry.totalCorridors, 0);
        assert.strictEqual(telemetry.activeCorridors, 0);
    });

    it('11. should execute universal squad purge with complete cascading purge', () => {
        const purgeResult = campusTopology.purgeAllSquads();
        assert.strictEqual(purgeResult.deletedSquads, 5);
        assert.strictEqual(purgeResult.deletedCorridors, 5);
        assert.strictEqual(campusTopology.getAllSquads().length, 0);
        assert.strictEqual(campusTopology.getAllCorridors().length, 0);
    });
});
