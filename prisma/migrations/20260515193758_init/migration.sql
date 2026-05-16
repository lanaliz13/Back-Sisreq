-- CreateTable
CREATE TABLE `Usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `senha` VARCHAR(191) NOT NULL,
    `tipo` ENUM('ALUNO', 'SERVIDOR', 'ADMIN') NOT NULL,
    `matricula` VARCHAR(191) NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Usuario_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Requerimento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `protocolo` VARCHAR(191) NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NOT NULL,
    `status` ENUM('ABERTO', 'EM_ANALISE', 'AGUARDANDO_AJUSTE', 'DEFERIDO', 'INDEFERIDO', 'CANCELADO') NOT NULL DEFAULT 'ABERTO',
    `prioridade` ENUM('BAIXA', 'MEDIA', 'ALTA') NOT NULL DEFAULT 'MEDIA',
    `justificativaServidor` VARCHAR(191) NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL,
    `usuarioId` INTEGER NOT NULL,

    UNIQUE INDEX `Requerimento_protocolo_key`(`protocolo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Anexo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nomeArquivo` VARCHAR(191) NOT NULL,
    `caminho` VARCHAR(191) NOT NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `requerimentoId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Requerimento` ADD CONSTRAINT `Requerimento_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Anexo` ADD CONSTRAINT `Anexo_requerimentoId_fkey` FOREIGN KEY (`requerimentoId`) REFERENCES `Requerimento`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
